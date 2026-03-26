from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user
from models.user import User
from schemas.learning_path import LearningPathResponse, LearningPathUpdate
from services.learning_path_service import (
    generate_learning_paths,
    get_user_learning_paths,
    update_path_progress,
)

router = APIRouter(prefix="/learning-path", tags=["Learning Path"])


@router.get("", response_model=list[LearningPathResponse])
def get_paths(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    paths = get_user_learning_paths(db, current_user.id)
    if not paths:
        paths = generate_learning_paths(db, current_user.id)
    return paths


@router.post("/generate", response_model=list[LearningPathResponse])
def regenerate_paths(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return generate_learning_paths(db, current_user.id)


@router.put("/{path_id}", response_model=LearningPathResponse)
def update_progress(
    path_id: int,
    payload: LearningPathUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return update_path_progress(db, path_id, current_user.id, payload.progress or 0)
