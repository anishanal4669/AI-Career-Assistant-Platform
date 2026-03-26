from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProfileCreate(BaseModel):
    bio: str = ""
    interests: list[str] = []
    preferred_regions: list[str] = []
    skills: list[str] = []


class ProfileUpdate(BaseModel):
    bio: Optional[str] = None
    interests: Optional[list[str]] = None
    preferred_regions: Optional[list[str]] = None
    skills: Optional[list[str]] = None


class ProfileResponse(BaseModel):
    id: int
    user_id: int
    bio: str
    interests: list[str]
    preferred_regions: list[str]
    skills: list[str]

    class Config:
        from_attributes = True
