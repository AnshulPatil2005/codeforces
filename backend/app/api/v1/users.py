from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List
from app.services.codeforces_client import get_cf_client
from collections import defaultdict
from datetime import datetime

router = APIRouter(prefix="/users", tags=["users"])

# Known top Codeforces users for leaderboard
TOP_USERS = [
    "tourist", "Benq", "jiangly", "ecnerwala", "Um_nik",
    "Petr", "maroonrk", "ksun48", "Radewoosh", "mnbvmar"
]


def calculate_monthly_growth(rating_history: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Calculate monthly rating growth from rating history"""
    if not rating_history:
        return []

    monthly_data = defaultdict(lambda: {"change": 0, "contests": 0})

    for change in rating_history:
        timestamp = change.get("ratingUpdateTimeSeconds", 0)
        dt = datetime.fromtimestamp(timestamp)
        month_key = dt.strftime("%b %Y")

        monthly_data[month_key]["change"] += change.get("rating_change", 0)
        monthly_data[month_key]["contests"] += 1

    # Get last 3 months
    result = [
        {"month": month, **data}
        for month, data in sorted(monthly_data.items())[-3:]
    ]

    return result


def calculate_performance_metrics(rating_history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calculate performance metrics from rating history"""
    if not rating_history:
        return {
            "total_contests": 0,
            "average_rank": 0,
            "positive_contests": 0,
            "negative_contests": 0,
            "average_change": 0,
            "best_rank": 0
        }

    ranks = [c.get("rank", 0) for c in rating_history]
    changes = [c.get("rating_change", 0) for c in rating_history]

    return {
        "total_contests": len(rating_history),
        "average_rank": sum(ranks) // len(ranks) if ranks else 0,
        "positive_contests": sum(1 for c in changes if c > 0),
        "negative_contests": sum(1 for c in changes if c < 0),
        "average_change": sum(changes) // len(changes) if changes else 0,
        "best_rank": min(ranks) if ranks else 0
    }


@router.get("/search")
async def search_users_endpoint(q: str = Query(..., min_length=1)):
    """Search users by handle using Codeforces API"""
    cf_client = get_cf_client()

    # Try to fetch the user directly
    user = await cf_client.get_user_info(q)

    if user:
        return {"users": [user], "count": 1}
    else:
        return {"users": [], "count": 0}


@router.get("/leaderboard")
async def get_leaderboard_endpoint():
    """Get leaderboard with top Codeforces users"""
    cf_client = get_cf_client()

    users_list = []
    for handle in TOP_USERS:
        user = await cf_client.get_user_info(handle)
        if user:
            users_list.append(user)

    # Sort by rating
    users_list.sort(key=lambda x: x.get("rating", 0), reverse=True)

    return {"users": users_list, "count": len(users_list)}


@router.get("/{handle}")
async def get_user(handle: str):
    """Get user by handle from Codeforces API"""
    cf_client = get_cf_client()

    user = await cf_client.get_user_info(handle)
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{handle}' not found on Codeforces")

    return user


@router.get("/{handle}/dashboard")
async def get_dashboard(handle: str) -> Dict[str, Any]:
    """Get dashboard data from Codeforces API"""
    cf_client = get_cf_client()

    # Fetch user info and rating history
    user = await cf_client.get_user_info(handle)
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{handle}' not found on Codeforces")

    rating_history = await cf_client.get_user_rating_history(handle)

    # Calculate stats
    monthly_growth = calculate_monthly_growth(rating_history)
    performance_metrics = calculate_performance_metrics(rating_history)

    # Get last rating change
    last_change = rating_history[-1].get("rating_change", 0) if rating_history else 0

    # Get last 10 contests for history
    contest_history = rating_history[-10:] if rating_history else []

    # Generate insights
    insights = [
        f"Current rating: {user['rating']}",
        f"Max rating: {user['maxRating']}",
    ]

    if last_change > 0:
        insights.append(f"Last contest: +{last_change}")
    elif last_change < 0:
        insights.append(f"Last contest: {last_change}")

    if performance_metrics["total_contests"] > 0:
        insights.append(f"Best rank: #{performance_metrics['best_rank']}")

    return {
        "user": user,
        "stats": {
            "current_rating": user["rating"],
            "max_rating": user["maxRating"],
            "last_change": last_change,
            "total_contests": len(rating_history),
            "current_rank": user["rank"],
            "max_rank": user["maxRank"]
        },
        "monthly_growth": monthly_growth,
        "contest_history": contest_history,
        "performance_metrics": performance_metrics,
        "insights": insights
    }
