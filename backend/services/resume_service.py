import os
import shutil
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException

from config import UPLOAD_DIR
from models.resume import Resume

# Simulated skill extraction — replace with NLP/LLM parser later
KNOWN_SKILLS = [
    "python", "javascript", "typescript", "react", "next.js", "node.js",
    "fastapi", "django", "flask", "sql", "postgresql", "mongodb",
    "docker", "kubernetes", "aws", "azure", "gcp", "git",
    "machine learning", "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "pandas", "numpy", "scikit-learn",
    "java", "c++", "c", "rust", "go", "verilog", "vhdl",
    "vlsi", "fpga", "embedded systems", "linux", "ci/cd",
    "html", "css", "tailwind", "graphql", "rest api",
]


def parse_skills_from_filename(filename: str) -> list[str]:
    """Placeholder skill parser. In production, use NLP/LLM to parse resume content."""
    name_lower = filename.lower()
    matched = [s for s in KNOWN_SKILLS if s.replace(" ", "") in name_lower.replace(" ", "")]
    # Return some default skills when we can't parse from filename
    if not matched:
        matched = ["python", "javascript", "sql"]
    return matched


def upload_resume(db: Session, user_id: int, file: UploadFile) -> Resume:
    allowed_extensions = (".pdf", ".docx")
    if not file.filename or not file.filename.lower().endswith(allowed_extensions):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are allowed")

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Sanitize filename: use user_id prefix to avoid collisions
    safe_name = f"{user_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    parsed_skills = parse_skills_from_filename(file.filename)

    resume = Resume(
        user_id=user_id,
        file_name=file.filename,
        file_path=file_path,
        parsed_skills=parsed_skills,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


def get_user_resumes(db: Session, user_id: int) -> list[Resume]:
    return db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.uploaded_at.desc()).all()
