"""Database Models Module for LMS Platform.

This module defines the database models and connection setup for the LMS platform.
It includes the User model and database connection configuration.
"""

import os
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

# Load environment variables from .env if present
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        pass
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://lms_user:lms_password@localhost:5432/thoth")

print(f"[DB] Using DATABASE_URL: {DATABASE_URL}")

# SQLAlchemy setup
Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

class User(Base):
    """User model representing registered users in the system.
    
    This model stores user credentials and settings. The password is stored
    as a hash, never in plain text.
    
    Attributes:
        userId: Unique identifier for the user
        username: Unique username for authentication
        hashed_password: Bcrypt hash of the user's password
        max_file_size: Maximum allowed file size in bytes (default: 500MB)
    """
    __tablename__ = "users"
    userId = Column(Integer, primary_key=True, autoincrement=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String)
    max_file_size = Column(Integer, default=524288000)  # 500MB default max file size

# DO NOT run migrations or create tables at import time in serverless environments!
# Run this manually in a migration script or CLI, not here:
# Base.metadata.create_all(bind=engine)
