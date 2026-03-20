from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database import Base

#user table storing all registered users
class User(Base):
    __tablename__ = "users"    #table name

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

from sqlalchemy import ForeignKey

#Resume table 
class Resume(Base):
    __tablename__ = "resumes"  #table name 

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    #links resume to specific user 
    file_name = Column(String)
    file_path = Column(String)
    uploaded_at = Column(DateTime, default=datetime.utcnow)