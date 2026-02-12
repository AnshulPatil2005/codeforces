import httpx
from typing import Optional, Dict, Any, List
import logging

logger = logging.getLogger(__name__)

class CodeforcesClient:
    """Client for Codeforces API"""

    BASE_URL = "https://codeforces.com/api"

    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)

    async def get_user_info(self, handle: str) -> Optional[Dict[str, Any]]:
        """Get user info from Codeforces API"""
        try:
            url = f"{self.BASE_URL}/user.info?handles={handle}"
            response = await self.client.get(url)
            response.raise_for_status()

            data = response.json()
            if data.get("status") != "OK":
                logger.error(f"CF API error: {data.get('comment')}")
                return None

            if not data.get("result") or len(data["result"]) == 0:
                return None

            user = data["result"][0]

            # Transform to our format
            return {
                "handle": user.get("handle", handle),
                "rating": user.get("rating", 0),
                "maxRating": user.get("maxRating", 0),
                "rank": user.get("rank", "unrated"),
                "maxRank": user.get("maxRank", "unrated"),
                "avatar": user.get("titlePhoto", f"https://ui-avatars.com/api/?name={handle}&background=random&color=fff"),
                "contribution": user.get("contribution", 0),
                "friendOfCount": user.get("friendOfCount", 0),
            }
        except Exception as e:
            logger.error(f"Error fetching user {handle}: {e}")
            return None

    async def get_user_rating_history(self, handle: str) -> List[Dict[str, Any]]:
        """Get user rating history from Codeforces API"""
        try:
            url = f"{self.BASE_URL}/user.rating?handle={handle}"
            response = await self.client.get(url)
            response.raise_for_status()

            data = response.json()
            if data.get("status") != "OK":
                return []

            changes = data.get("result", [])

            # Transform to our format
            return [
                {
                    "contestId": change.get("contestId"),
                    "contestName": change.get("contestName"),
                    "handle": handle,
                    "rank": change.get("rank"),
                    "ratingUpdateTimeSeconds": change.get("ratingUpdateTimeSeconds"),
                    "oldRating": change.get("oldRating"),
                    "newRating": change.get("newRating"),
                    "rating_change": change.get("newRating", 0) - change.get("oldRating", 0)
                }
                for change in changes
            ]
        except Exception as e:
            logger.error(f"Error fetching rating history for {handle}: {e}")
            return []

    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()

# Singleton instance
_cf_client: Optional[CodeforcesClient] = None

def get_cf_client() -> CodeforcesClient:
    """Get or create Codeforces client singleton"""
    global _cf_client
    if _cf_client is None:
        _cf_client = CodeforcesClient()
    return _cf_client
