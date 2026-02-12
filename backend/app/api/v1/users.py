from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from app.data import get_user_by_handle, search_users, get_leaderboard
from app.services.rating_service import RatingService
from app.models.rating import RatingChange

router = APIRouter(prefix="/users", tags=["users"])
rating_service = RatingService()


@router.get("/search")
async def search_users_endpoint(q: str = Query(..., min_length=1)):
    """
    Search users by handle.

    Args:
        q: Search query

    Returns:
        List of matching users
    """
    results = search_users(q)
    return {"users": results, "count": len(results)}


@router.get("/leaderboard")
async def get_leaderboard_endpoint():
    """
    Get leaderboard with all users ranked by rating.

    Returns:
        List of users sorted by rating
    """
    leaderboard = get_leaderboard()
    return {"users": leaderboard, "count": len(leaderboard)}


@router.get("/{handle}")
async def get_user(handle: str):
    """
    Get user information by handle.

    Args:
        handle: User handle

    Returns:
        User object
    """
    user = get_user_by_handle(handle)
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{handle}' not found")

    # Extract just the user info without contest history
    user_info = {
        "handle": user["handle"],
        "rating": user["rating"],
        "maxRating": user["maxRating"],
        "rank": user["rank"],
        "maxRank": user["maxRank"],
        "avatar": user["avatar"],
        "contribution": user["contribution"],
        "friendOfCount": user["friendOfCount"]
    }
    return user_info


@router.get("/{handle}/rating-history")
async def get_rating_history(handle: str):
    """
    Get user rating history.

    Args:
        handle: User handle

    Returns:
        List of rating changes
    """
    user = get_user_by_handle(handle)
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{handle}' not found")

    # Convert contest history to RatingChange format
    contest_history = []
    for contest in user["contest_history"]:
        contest_history.append({
            "contestId": contest["contestId"],
            "contestName": contest["contestName"],
            "handle": user["handle"],
            "rank": contest["rank"],
            "ratingUpdateTimeSeconds": contest["ratingUpdateTimeSeconds"],
            "oldRating": contest["oldRating"],
            "newRating": contest["newRating"],
            "rating_change": contest["newRating"] - contest["oldRating"]
        })

    return contest_history


@router.get("/{handle}/dashboard")
async def get_dashboard(handle: str) -> Dict[str, Any]:
    """
    Get dashboard data for a user.

    Args:
        handle: User handle

    Returns:
        Dashboard data including stats, charts, and insights
    """
    user = get_user_by_handle(handle)
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{handle}' not found")

    # Convert contest history to RatingChange objects for calculations
    rating_history = []
    for contest in user["contest_history"]:
        rating_history.append(RatingChange(
            contestId=contest["contestId"],
            contestName=contest["contestName"],
            handle=user["handle"],
            rank=contest["rank"],
            ratingUpdateTimeSeconds=contest["ratingUpdateTimeSeconds"],
            oldRating=contest["oldRating"],
            newRating=contest["newRating"]
        ))

    # Calculate dashboard metrics
    monthly_growth = rating_service.calculate_monthly_growth(rating_history)
    performance_metrics = rating_service.get_performance_metrics(rating_history)

    # Generate insights
    insights = []
    if rating_history:
        last_change = rating_history[-1].rating_change
        insights.append(f"Last contest: {'+' if last_change > 0 else ''}{last_change} points")

        # Find best rank
        best_rank = min(contest.rank for contest in rating_history)
        best_contest = next(c for c in rating_history if c.rank == best_rank)
        insights.append(f"Best rank: #{best_rank} in {best_contest.contestName}")

        # Rating difference from peak
        rating_diff = user["maxRating"] - user["rating"]
        if rating_diff > 0:
            insights.append(f"{rating_diff} points away from peak rating")
        else:
            insights.append("Currently at peak rating!")

        # Check for positive streak
        positive_streak = 0
        for contest in reversed(rating_history):
            if contest.rating_change > 0:
                positive_streak += 1
            else:
                break
        if positive_streak >= 2:
            insights.append(f"On a {positive_streak}-contest positive streak!")

        # Contest experience
        total_contests = len(rating_history)
        if total_contests >= 50:
            insights.append(f"Veteran with {total_contests}+ contests!")
        elif total_contests >= 20:
            insights.append(f"Experienced competitor with {total_contests} contests")

    # Get last rating change
    last_change = rating_history[-1].rating_change if rating_history else 0

    return {
        "user": {
            "handle": user["handle"],
            "rating": user["rating"],
            "maxRating": user["maxRating"],
            "rank": user["rank"],
            "maxRank": user["maxRank"],
            "avatar": user["avatar"],
            "contribution": user["contribution"],
            "friendOfCount": user["friendOfCount"]
        },
        "stats": {
            "current_rating": user["rating"],
            "max_rating": user["maxRating"],
            "last_change": last_change,
            "total_contests": len(rating_history),
            "current_rank": user["rank"],
            "max_rank": user["maxRank"]
        },
        "monthly_growth": monthly_growth,
        "contest_history": [
            {
                "contestId": c.contestId,
                "contestName": c.contestName,
                "handle": c.handle,
                "rank": c.rank,
                "ratingUpdateTimeSeconds": c.ratingUpdateTimeSeconds,
                "oldRating": c.oldRating,
                "newRating": c.newRating,
                "rating_change": c.rating_change
            }
            for c in rating_history[-10:]  # Last 10 contests
        ],
        "performance_metrics": performance_metrics,
        "insights": insights
    }


@router.get("/{handle}/insights")
async def get_insights(handle: str) -> Dict[str, Any]:
    """
    Get performance insights for a user.

    Args:
        handle: User handle

    Returns:
        Insights data including volatility, streaks, and peak rating
    """
    user = get_user_by_handle(handle)
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{handle}' not found")

    # Convert contest history to RatingChange objects
    rating_history = []
    for contest in user["contest_history"]:
        rating_history.append(RatingChange(
            contestId=contest["contestId"],
            contestName=contest["contestName"],
            handle=user["handle"],
            rank=contest["rank"],
            ratingUpdateTimeSeconds=contest["ratingUpdateTimeSeconds"],
            oldRating=contest["oldRating"],
            newRating=contest["newRating"]
        ))

    volatility = rating_service.calculate_volatility(rating_history)
    streaks = rating_service.find_positive_streaks(rating_history)
    peak_rating = rating_service.get_peak_rating(rating_history)

    return {
        "volatility": volatility,
        "streaks": streaks,
        "peak_rating": peak_rating
    }
