import { create } from 'zustand';
import { LegalNode, LegalEdge, LegalGraph } from '../types/graph.types';
import { useHistoryStore } from './historyStore';

interface GraphState {
  graphId: string | null;
  graphName: string;
  nodes: LegalNode[];
  edges: LegalEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  
  // Graph operations
  setGraph: (id: string, name: string, nodes: LegalNode[], edges: LegalEdge[]) => void;
  setGraphName: (name: string) => void;
  clearGraph: () => void;
  
  // Node operations
  addNode: (node: LegalNode) => void;
  updateNode: (id: string, data: Partial<LegalNode>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  
  // Edge operations
  addEdge: (edge: LegalEdge) => void;
  updateEdge: (id: string, data: Partial<LegalEdge>) => void;
  deleteEdge: (id: string) => void;
  selectEdge: (id: string | null) => void;
  
  // Batch operations
  setNodesAndEdges: (nodes: LegalNode[], edges: LegalEdge[]) => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  graphId: null,
  graphName: 'Untitled Graph',
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,

  setGraph: (id, name, nodes, edges) => set({
    graphId: id,
    graphName: name,
    nodes,
    edges,
  }),

  setGraphName: (name) => set({ graphName: name }),

  clearGraph: () => set({
    graphId: null,
    graphName: 'Untitled Graph',
    nodes: [],
    edges: [],
    selectedNodeId: null,
    selectedEdgeId: null,
  }),

  addNode: (node) => set((state) => {
    const newState = {
      nodes: [...state.nodes, node],
      edges: state.edges,
    };
    useHistoryStore.getState().saveState(newState.nodes, newState.edges);
    return newState;
  }),

  updateNode: (id, data) => set((state) => {
    const newState = {
      nodes: state.nodes.map(n => n.id === id ? { ...n, ...data } : n),
      edges: state.edges,
    };
    useHistoryStore.getState().saveState(newState.nodes, newState.edges);
    return newState;
  }),

  deleteNode: (id) => set((state) => {
    const newState = {
      nodes: state.nodes.filter(n => n.id !== id),
      edges: state.edges.filter(e => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    };
    useHistoryStore.getState().saveState(newState.nodes, newState.edges);
    return newState;
  }),

  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),

  addEdge: (edge) => set((state) => {
    const newState = {
      nodes: state.nodes,
      edges: [...state.edges, edge],
    };
    useHistoryStore.getState().saveState(newState.nodes, newState.edges);
    return newState;
  }),

  updateEdge: (id, data) => set((state) => {
    const newState = {
      nodes: state.nodes,
      edges: state.edges.map(e => e.id === id ? { ...e, ...data } : e),
    };
    useHistoryStore.getState().saveState(newState.nodes, newState.edges);
    return newState;
  }),

  deleteEdge: (id) => set((state) => {
    const newState = {
      nodes: state.nodes,
      edges: state.edges.filter(e => e.id !== id),
      selectedEdgeId: state.selectedEdgeId === id ? null : state.selectedEdgeId,
    };
    useHistoryStore.getState().saveState(newState.nodes, newState.edges);
    return newState;
  }),

  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

  setNodesAndEdges: (nodes, edges) => set((state) => {
    useHistoryStore.getState().saveState(nodes, edges);
    return { nodes, edges };
  }),
}));
