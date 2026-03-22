from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    role: str
    message: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
