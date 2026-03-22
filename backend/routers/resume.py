from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user
from models.user import User
from schemas.resume import ResumeResponse
from services.resume_service import upload_resume, get_user_resumes

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.post("/upload", response_model=ResumeResponse)
def upload(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return upload_resume(db, current_user.id, file)


@router.get("", response_model=list[ResumeResponse])
def list_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_user_resumes(db, current_user.id)
