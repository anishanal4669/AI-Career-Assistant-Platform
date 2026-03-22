from sqlalchemy.orm import Session

from models.job import Job
from models.resume import Resume
from models.profile import Profile


def get_all_jobs(db: Session) -> list[Job]:
    return db.query(Job).order_by(Job.created_at.desc()).all()


def get_matched_jobs(db: Session, user_id: int) -> list[dict]:
    """Match jobs against user skills from resume and profile."""
    user_skills: set[str] = set()

    # Gather skills from latest resume
    resume = db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.uploaded_at.desc()).first()
    if resume and resume.parsed_skills:
        user_skills.update(s.lower() for s in resume.parsed_skills)

    # Gather skills from profile
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if profile and profile.skills:
        user_skills.update(s.lower() for s in profile.skills)

    jobs = db.query(Job).all()
    results = []

    for job in jobs:
        required = {s.lower() for s in (job.required_skills or [])}
        if not required:
            score = 0.5
        else:
            overlap = user_skills & required
            score = len(overlap) / len(required) if required else 0

        results.append({
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "description": job.description,
            "required_skills": job.required_skills,
            "job_type": job.job_type,
            "match_score": round(score * 100, 1),
            "created_at": job.created_at,
        })

    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results


def create_job(db: Session, **kwargs) -> Job:
    job = Job(**kwargs)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job
