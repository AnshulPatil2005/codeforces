from typing import List, Dict, Any
from datetime import datetime
from collections import defaultdict
import statistics
from app.models.rating import RatingChange


class RatingService:
    """Service for rating calculations and analysis"""

    @staticmethod
    def calculate_monthly_growth(rating_history: List[RatingChange]) -> List[Dict[str, Any]]:
        """
        Calculate rating growth by month.

        Args:
            rating_history: List of rating changes

        Returns:
            List of monthly growth data
        """
        if not rating_history:
            return []

        monthly_data = defaultdict(lambda: {"total_change": 0, "contests": 0, "month": "", "year": 0})

        for change in rating_history:
            date = datetime.fromtimestamp(change.ratingUpdateTimeSeconds)
            key = f"{date.year}-{date.month:02d}"

            monthly_data[key]["total_change"] += change.rating_change
            monthly_data[key]["contests"] += 1
            monthly_data[key]["month"] = date.strftime("%b %Y")
            monthly_data[key]["year"] = date.year

        # Convert to sorted list
        result = []
        for key in sorted(monthly_data.keys()):
            result.append({
                "month": monthly_data[key]["month"],
                "change": monthly_data[key]["total_change"],
                "contests": monthly_data[key]["contests"]
            })

        return result

    @staticmethod
    def calculate_volatility(rating_history: List[RatingChange]) -> float:
        """
        Calculate rating volatility (standard deviation of rating changes).

        Args:
            rating_history: List of rating changes

        Returns:
            Volatility score
        """
        if len(rating_history) < 2:
            return 0.0

        changes = [change.rating_change for change in rating_history]
        return round(statistics.stdev(changes), 2)

    @staticmethod
    def find_positive_streaks(rating_history: List[RatingChange]) -> Dict[str, Any]:
        """
        Find consecutive positive rating changes.

        Args:
            rating_history: List of rating changes

        Returns:
            Dictionary with current and best streak info
        """
        if not rating_history:
            return {"current_streak": 0, "best_streak": 0}

        current_streak = 0
        best_streak = 0
        temp_streak = 0

        # Iterate through rating history in chronological order
        for change in rating_history:
            if change.rating_change > 0:
                temp_streak += 1
                best_streak = max(best_streak, temp_streak)
            else:
                temp_streak = 0

        # Calculate current streak (from the end)
        for change in reversed(rating_history):
            if change.rating_change > 0:
                current_streak += 1
            else:
                break

        return {
            "current_streak": current_streak,
            "best_streak": best_streak
        }

    @staticmethod
    def get_peak_rating(rating_history: List[RatingChange]) -> Dict[str, Any]:
        """
        Get peak rating details.

        Args:
            rating_history: List of rating changes

        Returns:
            Dictionary with peak rating info
        """
        if not rating_history:
            return {"rating": 0, "contest": "", "date": ""}

        peak_change = max(rating_history, key=lambda x: x.newRating)
        peak_date = datetime.fromtimestamp(peak_change.ratingUpdateTimeSeconds)

        return {
            "rating": peak_change.newRating,
            "contest": peak_change.contestName,
            "date": peak_date.strftime("%Y-%m-%d"),
            "contest_id": peak_change.contestId
        }

    @staticmethod
    def get_performance_metrics(rating_history: List[RatingChange]) -> Dict[str, Any]:
        """
        Calculate various performance metrics.

        Args:
            rating_history: List of rating changes

        Returns:
            Dictionary with performance metrics
        """
        if not rating_history:
            return {
                "total_contests": 0,
                "average_rank": 0,
                "positive_contests": 0,
                "negative_contests": 0,
                "average_change": 0
            }

        total_contests = len(rating_history)
        ranks = [change.rank for change in rating_history]
        changes = [change.rating_change for change in rating_history]

        positive_contests = sum(1 for change in changes if change > 0)
        negative_contests = sum(1 for change in changes if change < 0)

        return {
            "total_contests": total_contests,
            "average_rank": round(statistics.mean(ranks), 1) if ranks else 0,
            "positive_contests": positive_contests,
            "negative_contests": negative_contests,
            "average_change": round(statistics.mean(changes), 1) if changes else 0,
            "best_rank": min(ranks) if ranks else 0
        }
