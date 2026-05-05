from datetime import datetime
from typing import Optional, List
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.orm import relationship
from .base import Base # Giả sử có một class Base chung

class Graph(Base):
    __tablename__ = "graphs"

    id = Column(String, primary_key=True, index=True) # Dùng String cho UUID
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    nodes = relationship("Node", back_populates="graph", cascade="all, delete-orphan")
    edges = relationship("Edge", back_populates="graph", cascade="all, delete-orphan")
