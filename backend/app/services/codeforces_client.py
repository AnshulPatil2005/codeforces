import httpx
from typing import List, Optional, Dict, Any
from app.utils.rate_limiter import RateLimiter
from app.utils.cache import SimpleCache
from app.models.user import User
from app.models.rating import RatingChange, Contest
from app.models.problem import Problem, ProblemStatistics


class CodeforcesClient:
    """Client for interacting with Codeforces API"""

    BASE_URL = "https://codeforces.com/api"

    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
        self.rate_limiter = RateLimiter(max_calls=5, period=1.0)  # 5 calls per second
        self.cache = SimpleCache(maxsize=1000, ttl=300)  # 5-minute cache

    async def _make_request(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Make a rate-limited and cached request to Codeforces API.

        Args:
            endpoint: API endpoint (e.g., 'user.info')
            params: Query parameters

        Returns:
            API response data

        Raises:
            httpx.HTTPError: If the request fails
            ValueError: If the API returns an error status
        """
        # Create cache key from endpoint and params
        cache_key = f"{endpoint}:{str(params)}"

        # Check cache first
        if self.cache.has(cache_key):
            return self.cache.get(cache_key)

        # Apply rate limiting
        await self.rate_limiter.acquire()

        # Make request
        url = f"{self.BASE_URL}/{endpoint}"
        response = await self.client.get(url, params=params or {})
        response.raise_for_status()

        data = response.json()

        # Check if Codeforces API returned an error
        if data.get("status") != "OK":
            raise ValueError(f"Codeforces API error: {data.get('comment', 'Unknown error')}")

        result = data.get("result", {})

        # Cache the result
        self.cache.set(cache_key, result)

        return result

    async def get_user_info(self, handle: str) -> User:
        """
        Get user information.

        Args:
            handle: Codeforces handle

        Returns:
            User object
        """
        result = await self._make_request("user.info", {"handles": handle})

        if not result or len(result) == 0:
            raise ValueError(f"User '{handle}' not found")

        user_data = result[0]
        return User(**user_data)

    async def get_user_rating_history(self, handle: str) -> List[RatingChange]:
        """
        Get user rating history.

        Args:
            handle: Codeforces handle

        Returns:
            List of RatingChange objects
        """
        result = await self._make_request("user.rating", {"handle": handle})
        return [RatingChange(**item) for item in result]

    async def get_contest_list(self, gym: bool = False) -> List[Contest]:
        """
        Get list of contests.

        Args:
            gym: Include gym contests

        Returns:
            List of Contest objects
        """
        result = await self._make_request("contest.list", {"gym": str(gym).lower()})
        return [Contest(**item) for item in result]

    async def get_problemset_problems(self, tags: Optional[List[str]] = None) -> Dict[str, List]:
        """
        Get problemset problems.

        Args:
            tags: Filter by tags

        Returns:
            Dictionary with 'problems' and 'problemStatistics' lists
        """
        params = {}
        if tags:
            params["tags"] = ";".join(tags)

        result = await self._make_request("problemset.problems", params)

        problems = [Problem(**item) for item in result.get("problems", [])]
        statistics = [ProblemStatistics(**item) for item in result.get("problemStatistics", [])]

        return {"problems": problems, "statistics": statistics}

    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()
