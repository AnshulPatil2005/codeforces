from pydantic import BaseModel
from typing import List, Optional


class Problem(BaseModel):
    """Codeforces problem model"""
    contestId: Optional[int] = None
    problemsetName: Optional[str] = None
    index: str
    name: str
    type: str
    rating: Optional[int] = None
    tags: List[str] = []

    class Config:
        from_attributes = True


class ProblemStatistics(BaseModel):
    """Problem statistics model"""
    contestId: Optional[int] = None
    index: str
    solvedCount: int

    class Config:
        from_attributes = True


class ProblemWithStats(BaseModel):
    """Problem combined with statistics"""
    problem: Problem
    statistics: Optional[ProblemStatistics] = None
