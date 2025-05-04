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
import logging
from pathlib import Path

# Get the module's directory
MODULE_DIR = Path(__file__).parent
AI_AGENT_DIR = Path(__file__).parent.parent

# Provide safe defaults; these will be overwritten by update_client.
CLIENT_DIR = AI_AGENT_DIR
DATA_DIR = os.path.join(CLIENT_DIR, "data")
SHORT_TERM_MEMORY_FILE = os.path.join(DATA_DIR, "short_term_memory.json")
LONG_TERM_MEMORY_FILE = os.path.join(DATA_DIR,  "long_term_memory.json")
CONTEXT_FILE = os.path.join(DATA_DIR, "context.json")
REFERENCES_DIR = os.path.join(DATA_DIR,  "references")

# Create necessary directories if they don't exist
try:
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(REFERENCES_DIR, exist_ok=True)
    logging.info(f"Created directory structure: {DATA_DIR} and {REFERENCES_DIR}")
except Exception as e:
    logging.warning(f"Could not create directory structure: {e}")

# Import public functions and variables for module-level access
from aiagent.memory.loader import load_memory

from aiagent.memory.saver import save_memory
from aiagent.memory.memory_manager import BaseMemoryManager, ShortTermMemoryManager, LongTermMemoryManager
from aiagent.memory.client import update_client

__all__ = [
    "update_client",
    "load_memory",
    "save_memory",
    "SHORT_TERM_MEMORY_FILE",
    "LONG_TERM_MEMORY_FILE",
    "BaseMemoryManager",
    "ShortTermMemoryManager",
    "LongTermMemoryManager",
]
