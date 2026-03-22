from sqlalchemy.orm import Session

from models.learning_path import LearningPath
from models.profile import Profile
from models.resume import Resume

# Predefined learning paths by domain
DOMAIN_PATHS = {
    "ai": {
        "title": "AI / Machine Learning Engineer Path",
        "description": "Master the fundamentals of AI, from Python and math to deep learning and deployment.",
        "skills": ["Python", "NumPy", "Pandas", "Scikit-learn", "TensorFlow", "PyTorch", "MLOps", "NLP", "Computer Vision"],
    },
    "vlsi": {
        "title": "VLSI Design Engineer Path",
        "description": "Learn digital design, verification, and physical design for semiconductor careers.",
        "skills": ["Verilog", "VHDL", "SystemVerilog", "FPGA", "ASIC Design", "Synthesis", "STA", "DFT", "Physical Design"],
    },
    "frontend": {
        "title": "Frontend Engineer Path",
        "description": "Build modern, responsive web applications with industry-standard tools.",
        "skills": ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Testing", "Performance"],
    },
    "backend": {
        "title": "Backend Engineer Path",
        "description": "Design scalable APIs, databases, and distributed systems.",
        "skills": ["Python", "Node.js", "SQL", "PostgreSQL", "REST API", "Docker", "CI/CD", "System Design", "Redis"],
    },
    "devops": {
        "title": "DevOps Engineer Path",
        "description": "Automate infrastructure, deployments, and monitoring at scale.",
        "skills": ["Linux", "Docker", "Kubernetes", "Terraform", "CI/CD", "AWS", "Monitoring", "Networking", "Scripting"],
    },
    "fullstack": {
        "title": "Full-Stack Developer Path",
        "description": "End-to-end web development from frontend to backend and deployment.",
        "skills": ["React", "Next.js", "Node.js", "Python", "SQL", "REST API", "Docker", "Git", "Cloud Deployment"],
    },
}


def _detect_domains(skills: list[str]) -> list[str]:
    """Detect which learning domains match the user's skill profile."""
    skill_lower = {s.lower() for s in skills}
    domains = []

    ai_keywords = {"python", "machine learning", "deep learning", "tensorflow", "pytorch", "nlp", "pandas", "numpy", "scikit-learn"}
    vlsi_keywords = {"verilog", "vhdl", "fpga", "vlsi", "embedded systems", "asic"}
    frontend_keywords = {"react", "next.js", "javascript", "typescript", "html", "css", "tailwind"}
    backend_keywords = {"fastapi", "django", "flask", "node.js", "sql", "postgresql", "rest api"}
    devops_keywords = {"docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "linux", "terraform"}

    if skill_lower & ai_keywords:
        domains.append("ai")
    if skill_lower & vlsi_keywords:
        domains.append("vlsi")
    if skill_lower & frontend_keywords:
        domains.append("frontend")
    if skill_lower & backend_keywords:
        domains.append("backend")
    if skill_lower & devops_keywords:
        domains.append("devops")

    if not domains:
        domains = ["fullstack"]

    return domains


def generate_learning_paths(db: Session, user_id: int) -> list[LearningPath]:
    """Generate recommended learning paths based on user skills."""
    user_skills: list[str] = []

    resume = db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.uploaded_at.desc()).first()
    if resume and resume.parsed_skills:
        user_skills.extend(resume.parsed_skills)

    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if profile and profile.skills:
        user_skills.extend(profile.skills)

    # Remove existing paths for the user before regenerating
    db.query(LearningPath).filter(LearningPath.user_id == user_id).delete()
    db.commit()

    domains = _detect_domains(user_skills)
    paths = []

    for domain in domains:
        template = DOMAIN_PATHS[domain]
        path = LearningPath(
            user_id=user_id,
            title=template["title"],
            description=template["description"],
            skills=template["skills"],
            progress=0,
        )
        db.add(path)
        paths.append(path)

    db.commit()
    for p in paths:
        db.refresh(p)

    return paths


def get_user_learning_paths(db: Session, user_id: int) -> list[LearningPath]:
    return db.query(LearningPath).filter(LearningPath.user_id == user_id).all()


def update_path_progress(db: Session, path_id: int, user_id: int, progress: int) -> LearningPath:
    path = db.query(LearningPath).filter(LearningPath.id == path_id, LearningPath.user_id == user_id).first()
    if not path:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Learning path not found")
    path.progress = min(max(progress, 0), 100)
    db.commit()
    db.refresh(path)
    return path
