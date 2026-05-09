from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

router = APIRouter()

class NodeCreateSchema(BaseModel):
    graph_id: str
    type: str  # 'law', 'decree', 'article', etc.
    label: str
    content: Optional[str] = None
    x: float = 0
    y: float = 0
    width: Optional[float] = None
    height: Optional[float] = None

class NodeUpdateSchema(BaseModel):
    type: Optional[str] = None
    label: Optional[str] = None
    content: Optional[str] = None
    x: Optional[float] = None
    y: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None

from db.storage import storage

@router.post("/")
def create_node(data: NodeCreateSchema):
    """Thêm node mới vào graph"""
    node_id = str(uuid.uuid4())
    node = {
        "id": node_id,
        "graph_id": data.graph_id,
        "type": data.type,
        "label": data.label,
        "content": data.content,
        "x": data.x,
        "y": data.y,
        "width": data.width,
        "height": data.height,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    storage.save_node(node_id, node)
    return {"id": node_id, **node}

@router.get("/{node_id}")
def get_node(node_id: str):
    """Lấy thông tin một node"""
    nodes = storage.get_nodes()
    node = next((n for n in nodes if n["id"] == node_id), None)
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    return node

@router.put("/{node_id}")
def update_node(node_id: str, data: NodeUpdateSchema):
    """Cập nhật thông tin node (tọa độ, nội dung...)"""
    nodes = storage.get_nodes()
    node = next((n for n in nodes if n["id"] == node_id), None)
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    
    if data.type is not None:
        node["type"] = data.type
    if data.label is not None:
        node["label"] = data.label
    if data.content is not None:
        node["content"] = data.content
    if data.x is not None:
        node["x"] = data.x
    if data.y is not None:
        node["y"] = data.y
    if data.width is not None:
        node["width"] = data.width
    if data.height is not None:
        node["height"] = data.height
    node["updated_at"] = datetime.utcnow().isoformat()
    
    storage.save_node(node_id, node)
    return node

@router.delete("/{node_id}")
def delete_node(node_id: str):
    """Xóa node"""
    storage.delete_node(node_id)
    return {"message": f"Node {node_id} deleted"}

