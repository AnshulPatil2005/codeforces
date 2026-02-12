import httpx
from typing import Optional, Dict, Any, List
import logging
from app.utils.rate_limiter import RateLimiter
from app.utils.cache import SimpleCache
from app.config import settings

logger = logging.getLogger(__name__)

class CodeforcesClient:
    """Client for Codeforces API with Rate Limiting and Caching"""

    BASE_URL = settings.codeforces_api_base_url

    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
        self.rate_limiter = RateLimiter(
            max_calls=settings.rate_limit_calls,
            period=settings.rate_limit_period
        )
        self.cache = SimpleCache(ttl=settings.cache_ttl_seconds)

    async def get_user_info(self, handle: str) -> Optional[Dict[str, Any]]:
        """Get user info from Codeforces API"""
        cache_key = f"user_info_{handle}"
        cached = self.cache.get(cache_key)
        if cached:
            return cached

        try:
            await self.rate_limiter.acquire()
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
            result = {
                "handle": user.get("handle", handle),
                "rating": user.get("rating", 0),
                "maxRating": user.get("maxRating", 0),
                "rank": user.get("rank", "unrated"),
                "maxRank": user.get("maxRank", "unrated"),
                "avatar": user.get("titlePhoto", f"https://ui-avatars.com/api/?name={handle}&background=random&color=fff"),
                "contribution": user.get("contribution", 0),
                "friendOfCount": user.get("friendOfCount", 0),
            }
            self.cache.set(cache_key, result)
            return result
        except Exception as e:
            logger.error(f"Error fetching user {handle}: {e}")
            return None

    async def get_user_rating_history(self, handle: str) -> List[Dict[str, Any]]:
        """Get user rating history from Codeforces API"""
        cache_key = f"rating_history_{handle}"
        cached = self.cache.get(cache_key)
        if cached:
            return cached

        try:
            await self.rate_limiter.acquire()
            url = f"{self.BASE_URL}/user.rating?handle={handle}"
            response = await self.client.get(url)
            response.raise_for_status()

            data = response.json()
            if data.get("status") != "OK":
                return []

            changes = data.get("result", [])

            # Transform to our format
            result = [
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
            self.cache.set(cache_key, result)
            return result
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
