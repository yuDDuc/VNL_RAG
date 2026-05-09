from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

router = APIRouter()

from db.storage import storage

class EdgeCreateSchema(BaseModel):
    graph_id: str
    source_node_id: str
    target_node_id: str
    relation_type: str
    source_handle: Optional[str] = None
    target_handle: Optional[str] = None
    color: Optional[str] = None
    content: Optional[str] = None


class EdgeUpdateSchema(BaseModel):
    relation_type: Optional[str] = None
    source_handle: Optional[str] = None
    target_handle: Optional[str] = None
    color: Optional[str] = None
    content: Optional[str] = None

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
        "source_handle": data.source_handle,
        "target_handle": data.target_handle,
        "color": data.color,
        "content": data.content,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    storage.save_edge(edge_id, edge)
    return {"id": edge_id, **edge}

@router.get("/{edge_id}")
def get_edge(edge_id: str):
    """Lấy thông tin một edge"""
    edges = storage.get_edges()
    edge = next((e for e in edges if e["id"] == edge_id), None)
    if not edge:
        raise HTTPException(status_code=404, detail="Edge not found")
    return edge

@router.put("/{edge_id}")
def update_edge(edge_id: str, data: EdgeUpdateSchema):
    """Cập nhật loại quan hệ của edge"""
    edges = storage.get_edges()
    edge = next((e for e in edges if e["id"] == edge_id), None)
    if not edge:
        raise HTTPException(status_code=404, detail="Edge not found")
    
    if data.relation_type is not None:
        edge["relation_type"] = data.relation_type
    if data.source_handle is not None:
        edge["source_handle"] = data.source_handle
    if data.target_handle is not None:
        edge["target_handle"] = data.target_handle
    if data.color is not None:
        edge["color"] = data.color
    if data.content is not None:
        edge["content"] = data.content
    edge["updated_at"] = datetime.utcnow().isoformat()
    
    storage.save_edge(edge_id, edge)
    return edge

@router.delete("/{edge_id}")
def delete_edge(edge_id: str):
    """Xóa liên kết"""
    storage.delete_edge(edge_id)
    return {"message": f"Edge {edge_id} deleted"}

