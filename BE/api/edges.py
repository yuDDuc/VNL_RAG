from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

router = APIRouter()

class EdgeCreateSchema(BaseModel):
    graph_id: str
    source_node_id: str
    target_node_id: str
    relation_type: str  # 'reference', 'amend', 'replace', 'base_on', 'guide', 'related'

class EdgeUpdateSchema(BaseModel):
    relation_type: Optional[str] = None

# In-memory database
edges_db = {}

@router.post("/")
def create_edge(data: EdgeCreateSchema):
    """Thêm liên kết (edge) giữa 2 nodes"""
    edge_id = str(uuid.uuid4())
    edge = {
        "id": edge_id,
        "graph_id": data.graph_id,
        "source_node_id": data.source_node_id,
        "target_node_id": data.target_node_id,
        "relation_type": data.relation_type,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    edges_db[edge_id] = edge
    return {"id": edge_id, **edge}

@router.get("/{edge_id}")
def get_edge(edge_id: str):
    """Lấy thông tin một edge"""
    if edge_id not in edges_db:
        raise HTTPException(status_code=404, detail="Edge not found")
    return edges_db[edge_id]

@router.put("/{edge_id}")
def update_edge(edge_id: str, data: EdgeUpdateSchema):
    """Cập nhật loại quan hệ của edge"""
    if edge_id not in edges_db:
        raise HTTPException(status_code=404, detail="Edge not found")
    
    edge = edges_db[edge_id]
    if data.relation_type is not None:
        edge["relation_type"] = data.relation_type
    edge["updated_at"] = datetime.utcnow().isoformat()
    
    return edge

@router.delete("/{edge_id}")
def delete_edge(edge_id: str):
    """Xóa liên kết"""
    if edge_id not in edges_db:
        raise HTTPException(status_code=404, detail="Edge not found")
    
    del edges_db[edge_id]
    return {"message": f"Edge {edge_id} deleted"}

