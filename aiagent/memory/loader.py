#!/usr/bin/env python3

"""
Memory Loading Module

This module handles loading memory data from storage files.
It provides functions to safely load memory data and handle errors.
:noindex:
"""

import json
import logging
import os
from datetime import datetime
from typing import Any, Dict

# Import memory file paths from package __init__
from aiagent.memory import LONG_TERM_MEMORY_FILE, SHORT_TERM_MEMORY_FILE


def load_memory(memory_type: str) -> Dict[str, Any]:
    """Load memory data from a JSON file.

    Args:
        memory_type (str): Type of memory to load. Must be either 'short-term' or 'long-term'.

    Returns:
        dict: Dictionary containing the memory data

    Example:
        >>> memory = load_memory("short-term")
        >>> if "conversations" in memory:
        ...     print(f"Loaded {len(memory['conversations'])} conversations")

    :noindex:
    """
    if memory_type == "short-term":
        filepath = SHORT_TERM_MEMORY_FILE
    elif memory_type == "long-term":
        filepath = LONG_TERM_MEMORY_FILE
    else:
        raise ValueError(f"Invalid memory type: {memory_type}")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            memory = json.load(f)
            logging.info(f"Successfully loaded {memory_type} memory")
            return memory
    except FileNotFoundError:
        # If file doesn't exist, create it with default empty structure
        logging.warning(f"{memory_type} memory file not found: {filepath}")
        if memory_type == "short-term":
            default_memory = {
                "conversations": [],
                "preferences": {}
            }
        else:  # long-term
            default_memory = {
                "user_profile": {},
                "preferences": {},
                "long_term_goals": {},
                "last_updated": datetime.now().isoformat(),
            }
        save_memory(default_memory, memory_type)
        return default_memory
        
    except json.JSONDecodeError as e:
        logging.error(f"Error decoding JSON in {memory_type} memory: {str(e)}")
        raise
    except Exception as e:
        logging.error(f"Error loading {memory_type} memory: {str(e)}")
        raise
