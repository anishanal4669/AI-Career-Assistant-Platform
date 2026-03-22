from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user
from models.user import User
from services.job_service import get_all_jobs, get_matched_jobs

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("")
def list_jobs(db: Session = Depends(get_db)):
    """List all jobs (public)."""
    jobs = get_all_jobs(db)
    return [
        {
            "id": j.id,
            "title": j.title,
            "company": j.company,
            "location": j.location,
            "description": j.description,
            "required_skills": j.required_skills,
            "job_type": j.job_type,
            "created_at": j.created_at,
        }
        for j in jobs
    ]


@router.get("/matched")
def matched_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get jobs matched to the current user's skills."""
    return get_matched_jobs(db, current_user.id)
