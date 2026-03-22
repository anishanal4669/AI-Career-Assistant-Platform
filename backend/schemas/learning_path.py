from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class LearningPathResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: str
    skills: list[str]
    progress: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LearningPathUpdate(BaseModel):
    progress: Optional[int] = None
