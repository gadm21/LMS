
import json
import os
from typing import Dict, List, Optional, Any
    
from aiagent.memory import SHORT_TERM_MEMORY_FILE, LONG_TERM_MEMORY_FILE
from aiagent.memory.loader import load_memory
from aiagent.memory.saver import save_memory



class BaseMemoryManager:
    """
    Abstract base class for memory management.
    Provides shared logic for loading and saving memory.
    """
    memory_file: str = None  # To be set by subclasses

    def __init__(self):
        if self.memory_file is None:
            raise ValueError("memory_file must be defined in subclass")

    def save(self, data: Dict) -> None:
        """Save memory data to file."""
        save_memory(data, self.memory_type)

    def load(self) -> Dict:
        """Load memory data from file."""
        return load_memory(self.memory_type)

    @property
    def memory_type(self) -> str:
        raise NotImplementedError

    def set(self, key: str, value: Any) -> None:
        """Set a specific field in memory."""
        memory = self.load()
        # safely update the memory
        memory[key] = value
        
        self.save(memory)

    def get(self, key: str) -> Optional[Any]:
        """Get a specific field from memory."""
        memory = self.load()
        return memory.get(key, None)

class ShortTermMemoryManager(BaseMemoryManager):
    """
    Manages short-term memory operations.
    """
    memory_file = SHORT_TERM_MEMORY_FILE

    @property
    def memory_type(self) -> str:
        return "short-term"

    def update_active_url(self, url: str, title: str) -> None:
        """Update the active URL in short-term memory."""
        memory = self.load()
        memory.setdefault('active_url', {})['url'] = url
        memory['active_url']['title'] = title
        memory['active_url']['timestamp'] = self._get_timestamp()
        self.save(memory)

    def _get_timestamp(self) -> str:
        from datetime import datetime
        return datetime.utcnow().isoformat()

    def get_recent_conversations(self, limit: int = 10) -> List[Dict]:
        memory = self.load()
        conversations = memory.get('conversations', [])
        return conversations[-limit:]

class LongTermMemoryManager(BaseMemoryManager):
    """
    Manages long-term memory operations.
    """
    memory_file = LONG_TERM_MEMORY_FILE

    @property
    def memory_type(self) -> str:
        return "long-term"

    # You can add long-term specific methods here

        self.save_memory(memory, self.short_term_memory_file)
        
     

    def _get_timestamp(self) -> str:
        """Get current timestamp."""
        from datetime import datetime
        return datetime.utcnow().isoformat()
        

if __name__ == "__main__":
    # load short-term memory
    short_term_memory = ShortTermMemoryManager()
    print(short_term_memory.load())

    # update active url
    short_term_memory.update_active_url("https://www.example.com", "Example")
    print(short_term_memory.load())

    # set a field
    short_term_memory.set("test", "value")
    print(short_term_memory.get("test"))

    

