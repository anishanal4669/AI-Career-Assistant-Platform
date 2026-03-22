from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class JobCreate(BaseModel):
    title: str
    company: str
    location: str = "Remote"
    description: str = ""
    required_skills: list[str] = []
    job_type: str = "full-time"


class JobResponse(BaseModel):
    id: int
    title: str
    company: str
    location: str
    description: str
    required_skills: list[str]
    job_type: str
    match_score: Optional[float] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
