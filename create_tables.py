#!/usr/bin/env python3
"""
Database Table Creation Script

This script creates all the tables defined in the models.
Run this script directly to create or update the database schema.
"""

import logging
from server.db import Base, engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_tables():
    """Create all tables defined in the SQLAlchemy models."""
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Tables created successfully!")

if __name__ == "__main__":
    create_tables()
