from sqlalchemy.orm import Session

from models.profile import Profile


def get_profile(db: Session, user_id: int) -> Profile | None:
    return db.query(Profile).filter(Profile.user_id == user_id).first()


def create_profile(db: Session, user_id: int, **kwargs) -> Profile:
    profile = Profile(user_id=user_id, **kwargs)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def update_profile(db: Session, user_id: int, **kwargs) -> Profile:
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        profile = Profile(user_id=user_id)
        db.add(profile)

    for key, value in kwargs.items():
        if value is not None:
            setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return profile
