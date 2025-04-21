#!/usr/bin/env python3

"""
Handler package for AI agent.
This file marks the handler directory as a Python package.
"""
__version__ = "0.1.0"

import os
from pathlib import Path

# Get the module's directory
MODULE_DIR = Path(__file__).parent
AI_AGENT_DIR = Path(__file__).parent.parent

# Define memory file paths relative to the module's location
DATA_DIR = os.path.join(AI_AGENT_DIR, "data")
SHORT_TERM_MEMORY_FILE = os.path.join(DATA_DIR, "short_term_memory.json")
LONG_TERM_MEMORY_FILE = os.path.join(DATA_DIR,  "long_term_memory.json")
CONTEXT_FILE = os.path.join(DATA_DIR, "context.json")
REFERENCES_DIR = os.path.join(DATA_DIR,  "references")

# Ensure memory directory exists
os.makedirs(DATA_DIR, exist_ok=True)

# Import public functions and variables for module-level access
from aiagent.handler.cli import main
from aiagent.handler.query import ask_ai

__all__ = [
    "main",
    "ask_ai",
]
    