#!/usr/bin/env python3

"""
Memory Management Module

This module provides functions for managing AI agent memory.
It handles both short-term and long-term memory storage and retrieval.

Example usage:
    >>> from aiagent.memory import update_short_term_memory, get_memory_context
    >>> update_short_term_memory("What's the weather?", "Sunny", "Weather query")
    >>> context = get_memory_context()
"""

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
from aiagent.memory.loader import load_memory

from aiagent.memory.saver import save_memory
from aiagent.memory.memory_manager import BaseMemoryManager, ShortTermMemoryManager, LongTermMemoryManager

__all__ = [
    "load_memory",
    "save_memory",
    "SHORT_TERM_MEMORY_FILE",
    "LONG_TERM_MEMORY_FILE",
    "BaseMemoryManager",
    "ShortTermMemoryManager",
    "LongTermMemoryManager",
]
