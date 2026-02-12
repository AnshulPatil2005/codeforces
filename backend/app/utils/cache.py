from cachetools import TTLCache
from typing import Any, Optional


class SimpleCache:
    """Simple TTL-based cache wrapper"""

    def __init__(self, maxsize: int = 1000, ttl: int = 300):
        """
        Initialize cache.

        Args:
            maxsize: Maximum number of items to cache
            ttl: Time-to-live in seconds (default: 5 minutes)
        """
        self.cache = TTLCache(maxsize=maxsize, ttl=ttl)

    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        return self.cache.get(key)

    def set(self, key: str, value: Any) -> None:
        """Set value in cache"""
        self.cache[key] = value

    def clear(self) -> None:
        """Clear all cache entries"""
        self.cache.clear()

    def has(self, key: str) -> bool:
        """Check if key exists in cache"""
        return key in self.cache
