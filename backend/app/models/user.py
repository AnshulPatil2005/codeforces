from pydantic import BaseModel
from typing import Optional


class User(BaseModel):
    """Codeforces user model"""
    handle: str
    rating: Optional[int] = None
    maxRating: Optional[int] = None
    rank: Optional[str] = None
    maxRank: Optional[str] = None
    avatar: Optional[str] = None
    titlePhoto: Optional[str] = None
    contribution: Optional[int] = None
    friendOfCount: Optional[int] = None

    class Config:
        from_attributes = True
