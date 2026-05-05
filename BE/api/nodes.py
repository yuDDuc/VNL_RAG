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

class NodeUpdateSchema(BaseModel):
    type: Optional[str] = None
    label: Optional[str] = None
    content: Optional[str] = None
    x: Optional[float] = None
    y: Optional[float] = None

# In-memory database
nodes_db = {}

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
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    nodes_db[node_id] = node
    return {"id": node_id, **node}

@router.get("/{node_id}")
def get_node(node_id: str):
    """Lấy thông tin một node"""
    if node_id not in nodes_db:
        raise HTTPException(status_code=404, detail="Node not found")
    return nodes_db[node_id]

@router.put("/{node_id}")
def update_node(node_id: str, data: NodeUpdateSchema):
    """Cập nhật thông tin node (tọa độ, nội dung...)"""
    if node_id not in nodes_db:
        raise HTTPException(status_code=404, detail="Node not found")
    
    node = nodes_db[node_id]
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
    node["updated_at"] = datetime.utcnow().isoformat()
    
    return node

@router.delete("/{node_id}")
def delete_node(node_id: str):
    """Xóa node"""
    if node_id not in nodes_db:
        raise HTTPException(status_code=404, detail="Node not found")
    
    del nodes_db[node_id]
    return {"message": f"Node {node_id} deleted"}

