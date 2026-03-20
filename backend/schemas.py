from pydantic import BaseModel, EmailStr
from datetime import datetime

# Request model for registration
class UserCreate(BaseModel):
    name: str
    email: EmailStr 
    #to make sure email is unique
    password: str

# Response model
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True
        # allows conversion from database object to JSON 

#Request model
class UserLogin(BaseModel):
    email: EmailStr
    password: str

#Response model
class Token(BaseModel):
    access_token: str
    token_type: str