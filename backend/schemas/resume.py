from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ResumeResponse(BaseModel):
    id: int
    user_id: int
    file_name: str
    parsed_skills: list[str]
    uploaded_at: Optional[datetime] = None

    class Config:
        from_attributes = True
