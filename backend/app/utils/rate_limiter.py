import time
import asyncio
from collections import deque
from typing import Deque


class RateLimiter:
    """Token bucket rate limiter for API calls"""

    def __init__(self, max_calls: int = 5, period: float = 1.0):
        """
        Initialize rate limiter.

        Args:
            max_calls: Maximum number of calls allowed in the period
            period: Time period in seconds
        """
        self.max_calls = max_calls
        self.period = period
        self.calls: Deque[float] = deque()
        self.lock = asyncio.Lock()

    async def acquire(self):
        """
        Acquire permission to make an API call.
        Blocks if rate limit is exceeded.
        """
        async with self.lock:
            now = time.time()

            # Remove calls outside the time window
            while self.calls and self.calls[0] < now - self.period:
                self.calls.popleft()

            # If we've hit the limit, wait
            if len(self.calls) >= self.max_calls:
                sleep_time = self.calls[0] + self.period - now
                if sleep_time > 0:
                    await asyncio.sleep(sleep_time)
                    # Remove expired calls after sleeping
                    now = time.time()
                    while self.calls and self.calls[0] < now - self.period:
                        self.calls.popleft()

            # Record this call
            self.calls.append(time.time())
