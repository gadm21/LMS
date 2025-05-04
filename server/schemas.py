"""Pydantic Schemas Module for LMS Platform.

This module defines data models used for request validation and response
serialization throughout the application. All models extend from Pydantic's
BaseModel to provide automatic validation, serialization, and documentation.
"""

from pydantic import BaseModel

class RegisterRequest(BaseModel):
    """Schema for user registration request.
    
    Validates incoming registration requests, ensuring they contain
    the required username and password fields.
    
    Attributes:
        username: Unique identifier for the user
        password: User's password (will be hashed before storage)
    """
    username: str
    password: str
