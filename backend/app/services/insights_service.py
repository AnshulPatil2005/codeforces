from typing import List, Dict, Any
from app.models.rating import RatingChange
from app.models.user import User


class InsightsService:
    """Service for generating performance insights"""

    @staticmethod
    def generate_dashboard_insights(user: User, rating_history: List[RatingChange]) -> List[str]:
        """
        Generate textual insights for dashboard.

        Args:
            user: User object
            rating_history: List of rating changes

        Returns:
            List of insight strings
        """
        insights = []

        if not rating_history:
            insights.append("No contest history available")
            return insights

        # Recent performance (last 3 contests)
        recent_contests = rating_history[-3:]
        if len(recent_contests) >= 3:
            recent_change = sum(c.rating_change for c in recent_contests)
            if recent_change > 0:
                insights.append(f"Up {recent_change} points in last 3 contests")
            elif recent_change < 0:
                insights.append(f"Down {abs(recent_change)} points in last 3 contests")
            else:
                insights.append("Stable performance in last 3 contests")

        # Best rank
        best_rank = min(rating_history, key=lambda x: x.rank)
        insights.append(f"Best rank: #{best_rank.rank} in {best_rank.contestName}")

        # Current rating vs max rating
        if user.rating and user.maxRating:
            diff = user.maxRating - user.rating
            if diff == 0:
                insights.append("Currently at peak rating!")
            elif diff > 0:
                insights.append(f"{diff} points away from peak rating")

        # Positive streak
        current_streak = 0
        for change in reversed(rating_history):
            if change.rating_change > 0:
                current_streak += 1
            else:
                break

        if current_streak >= 3:
            insights.append(f"On a {current_streak}-contest positive streak!")

        # Total contests milestone
        total = len(rating_history)
        if total >= 100:
            insights.append(f"Veteran with {total}+ contests!")
        elif total >= 50:
            insights.append(f"Experienced with {total} contests")

        return insights
