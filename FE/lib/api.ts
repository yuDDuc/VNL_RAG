const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface GraphDTO {
  id?: string;
  name: string;
  description?: string;
  type?: 'legal' | 'rag';
  content?: string;
  custom_relation_types?: string[];
}

export interface NodeDTO {
  id?: string;
  graph_id: string;
  type: string;
  label: string;
  content?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface EdgeDTO {
  id?: string;
  graph_id: string;
  source_node_id: string;
  target_node_id: string;
  relation_type: string;
  source_handle?: string;
  target_handle?: string;
  color?: string;
  content?: string;
}

// Graph APIs
export const graphAPI = {
  getAll: async () => {
    const res = await fetch(`${API_BASE}/graphs`);
    if (!res.ok) throw new Error('Failed to fetch graphs');
    return res.json();
  },

  getOne: async (id: string) => {
    const res = await fetch(`${API_BASE}/graphs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch graph');
    return res.json();
  },

  create: async (data: GraphDTO) => {
    const res = await fetch(`${API_BASE}/graphs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create graph');
    return res.json();
  },

  update: async (id: string, data: Partial<GraphDTO>) => {
    const res = await fetch(`${API_BASE}/graphs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update graph');
    return res.json();
  },

  delete: async (id: string) => {
    const res = await fetch(`${API_BASE}/graphs/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete graph');
    return res.json();
  },
};

// Node APIs
export const nodeAPI = {
  create: async (data: NodeDTO) => {
    const res = await fetch(`${API_BASE}/nodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create node');
    return res.json();
  },

  update: async (id: string, data: Partial<NodeDTO>) => {
    const res = await fetch(`${API_BASE}/nodes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update node');
    return res.json();
  },

  delete: async (id: string) => {
    const res = await fetch(`${API_BASE}/nodes/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete node');
    return res.json();
  },
};

// Edge APIs
export const edgeAPI = {
  create: async (data: EdgeDTO) => {
    const res = await fetch(`${API_BASE}/edges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create edge');
    return res.json();
  },

  update: async (id: string, data: Partial<EdgeDTO>) => {
    const res = await fetch(`${API_BASE}/edges/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update edge');
    return res.json();
  },

  delete: async (id: string) => {
    const res = await fetch(`${API_BASE}/edges/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete edge');
    return res.json();
  },
};
