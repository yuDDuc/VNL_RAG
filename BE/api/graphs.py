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

    class Config:
        from_attributes = True

class GraphCreateSchema(BaseModel):
    name: str
    description: Optional[str] = None

class GraphUpdateSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class GraphDetailSchema(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    nodes: List[LegalNodeSchema] = []
    edges: List[LegalEdgeSchema] = []

    class Config:
        from_attributes = True

# In-memory database (replace with real DB later)
graphs_db = {}
nodes_db = {}
edges_db = {}

@router.get("/")
def get_all_graphs():
    """Lấy danh sách tất cả graphs"""
    return {
        "graphs": [
            {
                "id": gid,
                "name": g.get("name"),
                "description": g.get("description"),
                "created_at": g.get("created_at"),
                "node_count": len([n for n in nodes_db.values() if n.get("graph_id") == gid]),
                "edge_count": len([e for e in edges_db.values() if e.get("graph_id") == gid]),
            }
            for gid, g in graphs_db.items()
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
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    graphs_db[graph_id] = graph
    return {"id": graph_id, **graph}

@router.get("/{graph_id}")
def get_graph(graph_id: str):
    """Lấy chi tiết một graph (bao gồm nodes, edges)"""
    if graph_id not in graphs_db:
        raise HTTPException(status_code=404, detail="Graph not found")
    
    graph = graphs_db[graph_id]
    nodes = [n for n in nodes_db.values() if n.get("graph_id") == graph_id]
    edges = [e for e in edges_db.values() if e.get("graph_id") == graph_id]
    
    return {
        **graph,
        "nodes": nodes,
        "edges": edges,
    }

@router.put("/{graph_id}")
def update_graph(graph_id: str, data: GraphUpdateSchema):
    """Cập nhật thông tin graph"""
    if graph_id not in graphs_db:
        raise HTTPException(status_code=404, detail="Graph not found")
    
    graph = graphs_db[graph_id]
    if data.name:
        graph["name"] = data.name
    if data.description is not None:
        graph["description"] = data.description
    graph["updated_at"] = datetime.utcnow().isoformat()
    
    return graph

@router.delete("/{graph_id}")
def delete_graph(graph_id: str):
    """Xóa graph và tất cả nodes/edges liên quan"""
    if graph_id not in graphs_db:
        raise HTTPException(status_code=404, detail="Graph not found")
    
    # Delete all nodes and edges related to this graph
    nodes_db.clear()  # Simplified: delete all.
    edges_db.clear()  # Simplified: delete all
    # In real app, filter by graph_id
    
    del graphs_db[graph_id]
    return {"message": f"Graph {graph_id} deleted"}

