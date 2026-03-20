from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite database path
DATABASE_URL = "sqlite:///./career_assistant.db"

# Creates engine (engine: connection to database file)
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# Sessionlocal= creates new sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()