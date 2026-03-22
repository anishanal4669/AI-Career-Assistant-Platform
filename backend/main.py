from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from models import User, Profile, Resume, Job, LearningPath, ChatHistory  # noqa: F401
from routers import auth, profile, resume, jobs, learning_path, chat

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Career Assistant API",
    description="Backend API for the AI Career Assistant Platform",
    version="1.0.0",
)

# CORS — allow the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(resume.router)
app.include_router(jobs.router)
app.include_router(learning_path.router)
app.include_router(chat.router)


@app.get("/")
def health_check():
    return {"status": "ok", "message": "AI Career Assistant API is running"}

