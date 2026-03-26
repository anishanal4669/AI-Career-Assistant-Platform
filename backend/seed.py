"""Seed script — populates the database with sample data."""

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine, Base
from models.user import User
from models.profile import Profile
from models.job import Job
from models.learning_path import LearningPath
from services.auth_service import hash_password

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# ── Sample Users ────────────────────────────────────────────
users_data = [
    {"name": "Alice Johnson", "email": "alice@example.com", "password": "password123"},
    {"name": "Bob Smith", "email": "bob@example.com", "password": "password123"},
    {"name": "Carol Lee", "email": "carol@example.com", "password": "password123"},
]

created_users = []
for u in users_data:
    existing = db.query(User).filter(User.email == u["email"]).first()
    if existing:
        created_users.append(existing)
        continue
    user = User(name=u["name"], email=u["email"], password_hash=hash_password(u["password"]))
    db.add(user)
    db.commit()
    db.refresh(user)
    created_users.append(user)
    print(f"Created user: {user.email}")

# ── Sample Profiles ─────────────────────────────────────────
profiles_data = [
    {
        "user_id": created_users[0].id,
        "bio": "CS student passionate about AI and machine learning",
        "interests": ["AI / Machine Learning", "Backend Development"],
        "preferred_regions": ["Remote", "India"],
        "skills": ["Python", "TensorFlow", "SQL", "FastAPI"],
    },
    {
        "user_id": created_users[1].id,
        "bio": "ECE student interested in VLSI and embedded systems",
        "interests": ["VLSI", "Embedded Systems"],
        "preferred_regions": ["India", "North America"],
        "skills": ["Verilog", "VHDL", "FPGA", "C", "Python"],
    },
    {
        "user_id": created_users[2].id,
        "bio": "Full-stack developer focusing on modern web technologies",
        "interests": ["Frontend Development", "DevOps"],
        "preferred_regions": ["Europe", "Remote"],
        "skills": ["React", "Next.js", "TypeScript", "Node.js", "Docker"],
    },
]

for p in profiles_data:
    existing = db.query(Profile).filter(Profile.user_id == p["user_id"]).first()
    if not existing:
        db.add(Profile(**p))
        print(f"Created profile for user_id={p['user_id']}")

db.commit()

# ── Sample Jobs ─────────────────────────────────────────────
jobs_data = [
    {
        "title": "AI/ML Engineer Intern",
        "company": "DeepTech Labs",
        "location": "Remote",
        "description": "Build and deploy ML models for production NLP and computer vision pipelines. Work with Python, PyTorch, and cloud infrastructure.",
        "required_skills": ["Python", "PyTorch", "TensorFlow", "NLP", "Docker"],
        "job_type": "internship",
    },
    {
        "title": "Frontend Developer",
        "company": "WebCraft Studios",
        "location": "Remote",
        "description": "Develop modern, responsive web applications using React and Next.js with TypeScript.",
        "required_skills": ["React", "Next.js", "TypeScript", "CSS", "Git"],
        "job_type": "full-time",
    },
    {
        "title": "VLSI Design Engineer",
        "company": "ChipWorks Semiconductor",
        "location": "Bangalore, India",
        "description": "RTL design and verification for next-gen SoCs. Work with Verilog, SystemVerilog, and UVM.",
        "required_skills": ["Verilog", "SystemVerilog", "FPGA", "ASIC Design", "Python"],
        "job_type": "full-time",
    },
    {
        "title": "Backend Developer Intern",
        "company": "CloudCore Systems",
        "location": "Europe",
        "description": "Build scalable REST APIs and microservices using Python and PostgreSQL.",
        "required_skills": ["Python", "FastAPI", "SQL", "Docker", "REST API"],
        "job_type": "internship",
    },
    {
        "title": "DevOps Engineer",
        "company": "InfraScale",
        "location": "North America",
        "description": "Automate CI/CD pipelines, manage Kubernetes clusters, and maintain cloud infrastructure on AWS.",
        "required_skills": ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Terraform"],
        "job_type": "full-time",
    },
    {
        "title": "Full-Stack Developer",
        "company": "StartupHub",
        "location": "Remote",
        "description": "End-to-end development of a SaaS platform using Next.js frontend and Python backend.",
        "required_skills": ["React", "Next.js", "Python", "PostgreSQL", "Docker"],
        "job_type": "full-time",
    },
    {
        "title": "Data Engineer Intern",
        "company": "DataMind Analytics",
        "location": "India",
        "description": "Build ETL pipelines and data warehousing solutions. Work with Python, SQL, and Apache Spark.",
        "required_skills": ["Python", "SQL", "Apache Spark", "AWS", "ETL"],
        "job_type": "internship",
    },
    {
        "title": "Embedded Systems Engineer",
        "company": "IoT Solutions Inc.",
        "location": "Bangalore, India",
        "description": "Develop firmware for IoT devices using C/C++ and interface with FPGA modules.",
        "required_skills": ["C", "C++", "Embedded Systems", "FPGA", "Linux"],
        "job_type": "full-time",
    },
]

for j in jobs_data:
    existing = db.query(Job).filter(Job.title == j["title"], Job.company == j["company"]).first()
    if not existing:
        db.add(Job(**j))
        print(f"Created job: {j['title']} at {j['company']}")

db.commit()

# ── Sample Learning Paths ───────────────────────────────────
paths_data = [
    {
        "user_id": created_users[0].id,
        "title": "AI / Machine Learning Engineer Path",
        "description": "Master the fundamentals of AI, from Python and math to deep learning and deployment.",
        "skills": ["Python", "NumPy", "Pandas", "Scikit-learn", "TensorFlow", "PyTorch", "MLOps"],
        "progress": 35,
    },
    {
        "user_id": created_users[1].id,
        "title": "VLSI Design Engineer Path",
        "description": "Learn digital design, verification, and physical design for semiconductor careers.",
        "skills": ["Verilog", "VHDL", "SystemVerilog", "FPGA", "ASIC Design", "Synthesis", "STA"],
        "progress": 20,
    },
    {
        "user_id": created_users[2].id,
        "title": "Full-Stack Developer Path",
        "description": "End-to-end web development from frontend to backend and deployment.",
        "skills": ["React", "Next.js", "Node.js", "Python", "SQL", "REST API", "Docker", "Git"],
        "progress": 60,
    },
]

for lp in paths_data:
    existing = db.query(LearningPath).filter(
        LearningPath.user_id == lp["user_id"],
        LearningPath.title == lp["title"],
    ).first()
    if not existing:
        db.add(LearningPath(**lp))
        print(f"Created learning path: {lp['title']}")

db.commit()
db.close()

print("\nSeed completed successfully!")
print(f"  Users: {len(users_data)}")
print(f"  Jobs: {len(jobs_data)}")
print(f"  Learning Paths: {len(paths_data)}")
print("\nSample login credentials:")
print("  Email: alice@example.com  Password: password123")
print("  Email: bob@example.com    Password: password123")
print("  Email: carol@example.com  Password: password123")
