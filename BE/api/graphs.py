from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import uuid

router = APIRouter()

# Pydantic models for request/response
class NodeData(BaseModel):
    label: str
    content: Optional[str] = None

class LegalNodeSchema(BaseModel):
    id: str
    graph_id: str
    type: str  # 'law', 'decree', 'article', etc.
    label: str
    content: Optional[str] = None
    x: float
    y: float
    width: Optional[float] = None
    height: Optional[float] = None

    class Config:
        from_attributes = True

class EdgeRelation(BaseModel):
    relation_type: str  # 'reference', 'amend', 'replace', 'base_on', 'guide', 'related'

class LegalEdgeSchema(BaseModel):
    id: str
    graph_id: str
    source_node_id: str
    target_node_id: str
    relation_type: str
    source_handle: Optional[str] = None
    target_handle: Optional[str] = None
    color: Optional[str] = None
    content: Optional[str] = None

    class Config:
        from_attributes = True

class GraphCreateSchema(BaseModel):
    name: str
    description: Optional[str] = None
    type: str = "legal"  # "legal" or "rag"
    custom_relation_types: Optional[List[str]] = []

class GraphUpdateSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    custom_relation_types: Optional[List[str]] = None

class GraphDetailSchema(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    type: str = "legal"
    created_at: datetime
    updated_at: datetime
    nodes: List[LegalNodeSchema] = []
    edges: List[LegalEdgeSchema] = []
    custom_relation_types: List[str] = []

    class Config:
        from_attributes = True

from db.storage import storage

@router.get("/")
def get_all_graphs():
    """Lấy danh sách tất cả graphs"""
    graphs = storage.get_graphs()
    return {
        "graphs": [
            {
                "id": g["id"],
                "name": g.get("name"),
                "description": g.get("description"),
                "type": g.get("type", "legal"),
                "created_at": g.get("created_at"),
                "node_count": len(storage.get_nodes(g["id"])),
                "edge_count": len(storage.get_edges(g["id"])),
            }
            for g in graphs
        ]
    }

@router.post("/")
def create_graph(data: GraphCreateSchema):
    """Tạo graph mới"""
    graph_id = str(uuid.uuid4())
    graph = {
        "id": graph_id,
        "name": data.name,
        "description": data.description,
        "type": data.type,
        "custom_relation_types": data.custom_relation_types or [],
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    storage.save_graph(graph_id, graph)
    return {"id": graph_id, **graph}

@router.get("/{graph_id}")
def get_graph(graph_id: str):
    """Lấy chi tiết một graph (bao gồm nodes, edges)"""
    graph = storage.get_graph(graph_id)
    if not graph:
        raise HTTPException(status_code=404, detail="Graph not found")
    
    nodes = storage.get_nodes(graph_id)
    edges = storage.get_edges(graph_id)
    
    return {
        **graph,
        "nodes": nodes,
        "edges": edges,
    }

@router.put("/{graph_id}")
def update_graph(graph_id: str, data: GraphUpdateSchema):
    """Cập nhật thông tin graph"""
    graph = storage.get_graph(graph_id)
    if not graph:
        raise HTTPException(status_code=404, detail="Graph not found")
    
    if data.name:
        graph["name"] = data.name
    if data.description is not None:
        graph["description"] = data.description
    if data.type is not None:
        graph["type"] = data.type
    if data.custom_relation_types is not None:
        graph["custom_relation_types"] = data.custom_relation_types
    graph["updated_at"] = datetime.utcnow().isoformat()
    
    storage.save_graph(graph_id, graph)
    return graph

@router.delete("/{graph_id}")
def delete_graph(graph_id: str):
    """Xóa graph và tất cả nodes/edges liên quan"""
    if not storage.get_graph(graph_id):
        raise HTTPException(status_code=404, detail="Graph not found")
    
    storage.delete_graph(graph_id)
    return {"message": f"Graph {graph_id} deleted"}

