from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Edge(Base):
    __tablename__ = "edges"

    id = Column(String, primary_key=True, index=True)
    graph_id = Column(String, ForeignKey("graphs.id"), index=True)
    source_node_id = Column(String, ForeignKey("nodes.id"))
    target_node_id = Column(String, ForeignKey("nodes.id"))
    relation_type = Column(String) # e.g., 'reference', 'amend', 'guide'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    graph = relationship("Graph", back_populates="edges")
    source_node = relationship("Node", foreign_keys=[source_node_id], back_populates="edges_out")
    target_node = relationship("Node", foreign_keys=[target_node_id], back_populates="edges_in")
