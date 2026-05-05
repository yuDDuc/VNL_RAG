import { create } from 'zustand';
import { LegalNode, LegalEdge } from '../types/graph.types';

interface HistoryState {
  nodes: LegalNode[];
  edges: LegalEdge[];
}

interface HistoryStoreState {
  past: HistoryState[];
  present: HistoryState;
  future: HistoryState[];
  
  // Capture current state
  saveState: (nodes: LegalNode[], edges: LegalEdge[]) => void;
  
  // Undo/Redo
  undo: () => HistoryState | null;
  redo: () => HistoryState | null;
  
  // Check if can undo/redo
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Clear history
  clear: () => void;
}

const initialState: HistoryState = {
  nodes: [],
  edges: [],
};

export const useHistoryStore = create<HistoryStoreState>((set, get) => ({
  past: [],
  present: initialState,
  future: [],

  saveState: (nodes, edges) => {
    set((state) => {
      const present = { nodes, edges };
      
      // Don't save if state hasn't changed
      if (
        JSON.stringify(state.present.nodes) === JSON.stringify(nodes) &&
        JSON.stringify(state.present.edges) === JSON.stringify(edges)
      ) {
        return state;
      }

      return {
        past: [...state.past, state.present],
        present,
        future: [], // Clear future when new action is performed
      };
    });
  },

  undo: () => {
    const state = get();
    if (state.past.length === 0) return null;

    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, -1);

    set({
      past: newPast,
      present: previous,
      future: [state.present, ...state.future],
    });

    return previous;
  },

  redo: () => {
    const state = get();
    if (state.future.length === 0) return null;

    const next = state.future[0];
    const newFuture = state.future.slice(1);

    set({
      past: [...state.past, state.present],
      present: next,
      future: newFuture,
    });

    return next;
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  clear: () => {
    set({
      past: [],
      present: initialState,
      future: [],
    });
  },
}));
