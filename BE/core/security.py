"""
Security utilities for Legal Graph API
"""

from typing import Optional

class SecurityUtils:
    """Security related utilities"""
    
    @staticmethod
    def validate_input(data: str, max_length: int = 10000) -> bool:
        """Validate input string"""
        if not isinstance(data, str):
            return False
        if len(data) > max_length:
            return False
        return True
    
    @staticmethod
    def sanitize_string(data: str) -> str:
        """Basic input sanitization"""
        if not isinstance(data, str):
            return ""
        return data.strip()

security_utils = SecurityUtils()
