"""
Configuration settings for Legal Graph application
"""

import os
from typing import Optional

# API Configuration
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", 8000))
API_DEBUG = os.getenv("API_DEBUG", "False").lower() == "true"

# Database Configuration (for future use)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./legal_graph.db"
)

# CORS Configuration
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

if os.getenv("ENVIRONMENT") == "production":
    CORS_ORIGINS = [
        "https://legal-graph.example.com",
    ]

# Graph Configuration
MAX_NODES_PER_GRAPH = 10000
MAX_EDGES_PER_GRAPH = 50000
GRAPH_EXPORT_FORMATS = ["json", "csv", "png"]

# Node Configuration
ALLOWED_NODE_TYPES = [
    "law",
    "decree",
    "circular",
    "article",
    "clause",
    "section",
]

# Edge Configuration
ALLOWED_RELATION_TYPES = [
    "reference",
    "amend",
    "replace",
    "base_on",
    "guide",
    "related",
]

class Settings:
    """Application settings"""
    
    debug: bool = API_DEBUG
    title: str = "Legal Graph API"
    version: str = "1.0.0"
    description: str = "API for managing legal document graphs"
    
    # Database
    database_url: str = DATABASE_URL
    
    # Server
    host: str = API_HOST
    port: int = API_PORT
    
    # CORS
    cors_origins: list = CORS_ORIGINS
    
    # Graph limits
    max_nodes_per_graph: int = MAX_NODES_PER_GRAPH
    max_edges_per_graph: int = MAX_EDGES_PER_GRAPH
    
    # Allowed values
    allowed_node_types: list = ALLOWED_NODE_TYPES
    allowed_relation_types: list = ALLOWED_RELATION_TYPES

settings = Settings()
