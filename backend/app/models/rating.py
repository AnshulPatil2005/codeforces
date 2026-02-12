from pydantic import BaseModel, computed_field
from typing import Optional


class RatingChange(BaseModel):
    """Codeforces rating change model"""
    contestId: int
    contestName: str
    handle: str
    rank: int
    ratingUpdateTimeSeconds: int
    oldRating: int
    newRating: int

    @computed_field
    @property
    def rating_change(self) -> int:
        """Calculate the rating change"""
        return self.newRating - self.oldRating

    class Config:
        from_attributes = True


class Contest(BaseModel):
    """Codeforces contest model"""
    id: int
    name: str
    type: str
    phase: str
    frozen: bool
    durationSeconds: int
    startTimeSeconds: Optional[int] = None
    relativeTimeSeconds: Optional[int] = None

    class Config:
        from_attributes = True
