from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.sql import func
from database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    location = Column(String(255), default="Remote")
    description = Column(String(2000), default="")
    required_skills = Column(JSON, default=list)
    job_type = Column(String(50), default="full-time")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
