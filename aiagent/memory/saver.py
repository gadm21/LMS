#!/usr/bin/env python3

"""
Memory Saving Module

This module handles saving memory data to storage files.
It provides functions to safely persist memory data and handle errors.
"""

import json
import logging
import os
from typing import Any, Dict

from aiagent.memory import SHORT_TERM_MEMORY_FILE, LONG_TERM_MEMORY_FILE

def save_memory(memory: Dict[str, Any], type: str) -> bool:
    """Save memory (short-term or long-term) to a JSON file.

    Ensures proper formatting and error handling when saving memory data.

    Args:
        memory (Dict[str, Any]): Memory data to save.
        type (str): Type of memory to save. Must be either 'short-term' or 'long-term'.

    Returns:
        bool: True if save was successful, False otherwise

    Example:
        >>> memory_data = {"conversations": [{"query": "Hello", "response": "Hi there!"}]}
        >>> success = save_memory(memory_data, "short-term")
        >>> print(f"Memory saved successfully: {success}")

    :noindex:
    """
    try:
        if type == "short-term":
            filepath = SHORT_TERM_MEMORY_FILE
        elif type == "long-term":
            filepath = LONG_TERM_MEMORY_FILE
        else:
            raise ValueError(f"Invalid memory type: {type}")
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

        # Write the memory data
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(memory, f, indent=2)
        logging.info(f"Successfully saved {type} memory to {filepath}")
        return True
    except OSError as e:
        logging.error(f"Error saving {type} memory to {filepath}: {e}")
        return False
            