from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Float, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Node(Base):
    __tablename__ = "nodes"

    id = Column(String, primary_key=True, index=True)
    graph_id = Column(String, ForeignKey("graphs.id"), index=True)
    type = Column(String, index=True) # e.g., 'law', 'decree', 'article'
    label = Column(String)
    content = Column(Text, nullable=True)
    x = Column(Float, default=0.0)
    y = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    graph = relationship("Graph", back_populates="nodes")
    # Tùy chọn: liên kết tới các edge (nguồn hoặc đích)
    edges_out = relationship("Edge", foreign_keys="[Edge.source_node_id]", back_populates="source_node")
    edges_in = relationship("Edge", foreign_keys="[Edge.target_node_id]", back_populates="target_node")
