from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user
from models.user import User
from schemas.user import ProfileCreate, ProfileUpdate, ProfileResponse, UserResponse
from services.profile_service import get_profile, create_profile, update_profile

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/details", response_model=ProfileResponse)
def get_my_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = get_profile(db, current_user.id)
    if not profile:
        profile = create_profile(db, current_user.id)
    return profile


@router.post("/details", response_model=ProfileResponse)
def create_my_profile(
    payload: ProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_profile(
        db,
        current_user.id,
        bio=payload.bio,
        interests=payload.interests,
        preferred_regions=payload.preferred_regions,
        skills=payload.skills,
    )


@router.put("/details", response_model=ProfileResponse)
def update_my_profile(
    payload: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return update_profile(
        db,
        current_user.id,
        bio=payload.bio,
        interests=payload.interests,
        preferred_regions=payload.preferred_regions,
        skills=payload.skills,
    )
