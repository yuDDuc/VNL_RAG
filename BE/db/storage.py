import json
import os
from typing import Dict, List, Any
from datetime import datetime

class JSONStorage:
    def __init__(self, file_path: str = None):
        # Use environment variable DATABASE_PATH if provided, otherwise default to a file next to this module
        if file_path:
            self.file_path = file_path
        else:
            # Resolve path relative to this storage module
            base_dir = os.path.dirname(os.path.abspath(__file__))
            self.file_path = os.path.join(base_dir, "database.json")
        self.data = {
            "graphs": {},
            "nodes": {},
            "edges": {}
        }
        self._load()

    def _load(self):
        if os.path.exists(self.file_path):
            try:
                self.last_mtime = os.path.getmtime(self.file_path)
                with open(self.file_path, "r", encoding="utf-8") as f:
                    self.data = json.load(f)
            except Exception as e:
                print(f"Error loading database: {e}")
                self.data = {"graphs": {}, "nodes": {}, "edges": {}}
        else:
            self.last_mtime = 0
            self._save()

    def _check_reload(self):
        """Kiểm tra nếu file database.json đã bị sửa bên ngoài thì load lại"""
        if os.path.exists(self.file_path):
            current_mtime = os.path.getmtime(self.file_path)
            if current_mtime > getattr(self, 'last_mtime', 0):
                self._load()

    def _save(self):
        try:
            with open(self.file_path, "w", encoding="utf-8") as f:
                json.dump(self.data, f, ensure_ascii=False, indent=2)
            self.last_mtime = os.path.getmtime(self.file_path)
        except Exception as e:
            print(f"Error saving database: {e}")

    # Graph operations
    def get_graphs(self) -> List[Dict]:
        self._check_reload()
        return list(self.data["graphs"].values())

    def get_graph(self, graph_id: str) -> Dict:
        self._check_reload()
        return self.data["graphs"].get(graph_id)

    def save_graph(self, graph_id: str, graph_data: Dict):
        self._check_reload()
        self.data["graphs"][graph_id] = graph_data
        self._save()

    def delete_graph(self, graph_id: str):
        self._check_reload()
        if graph_id in self.data["graphs"]:
            del self.data["graphs"][graph_id]
            # Clean up nodes and edges
            self.data["nodes"] = {nid: n for nid, n in self.data["nodes"].items() if n.get("graph_id") != graph_id}
            self.data["edges"] = {eid: e for eid, e in self.data["edges"].items() if e.get("graph_id") != graph_id}
            self._save()

    # Node operations
    def get_nodes(self, graph_id: str = None) -> List[Dict]:
        self._check_reload()
        if graph_id:
            return [n for n in self.data["nodes"].values() if n.get("graph_id") == graph_id]
        return list(self.data["nodes"].values())

    def save_node(self, node_id: str, node_data: Dict):
        self._check_reload()
        self.data["nodes"][node_id] = node_data
        self._save()

    def delete_node(self, node_id: str):
        self._check_reload()
        if node_id in self.data["nodes"]:
            del self.data["nodes"][node_id]
            # Clean up edges
            self.data["edges"] = {eid: e for eid, e in self.data["edges"].items() if e.get("source_node_id") != node_id and e.get("target_node_id") != node_id}
            self._save()

    # Edge operations
    def get_edges(self, graph_id: str = None) -> List[Dict]:
        self._check_reload()
        if graph_id:
            return [e for e in self.data["edges"].values() if e.get("graph_id") == graph_id]
        return list(self.data["edges"].values())

    def save_edge(self, edge_id: str, edge_data: Dict):
        self._check_reload()
        self.data["edges"][edge_id] = edge_data
        self._save()

    def delete_edge(self, edge_id: str):
        self._check_reload()
        if edge_id in self.data["edges"]:
            del self.data["edges"][edge_id]
            self._save()

# Global storage instance
storage = JSONStorage()
