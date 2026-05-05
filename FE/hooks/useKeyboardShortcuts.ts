import { useEffect } from 'react';
import { useGraphStore } from '../stores/graphStore';
import { useHistoryStore } from '../stores/historyStore';

interface ShortcutHandlers {
  onDelete?: (nodeId: string) => void;
  onSave?: () => void;
  selectedNodeId?: string | null;
}

export const useKeyboardShortcuts = (handlers: ShortcutHandlers) => {
  const { undo, redo, canUndo, canRedo } = useHistoryStore();
  const { nodes, edges, deleteNode } = useGraphStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMeta = event.ctrlKey || event.metaKey;

      // Ctrl/Cmd + Z: Undo
      if (isMeta && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (canUndo()) {
          const state = undo();
          if (state) {
            // Update graph store with historical state
            // This would require adding a method to graph store
          }
        }
      }

      // Ctrl/Cmd + Shift + Z: Redo
      if (isMeta && event.key === 'z' && event.shiftKey) {
        event.preventDefault();
        if (canRedo()) {
          const state = redo();
          if (state) {
            // Update graph store with historical state
          }
        }
      }

      // Delete key: Delete selected node
      if (event.key === 'Delete' && handlers.selectedNodeId) {
        event.preventDefault();
        deleteNode(handlers.selectedNodeId);
        if (handlers.onDelete) {
          handlers.onDelete(handlers.selectedNodeId);
        }
      }

      // Ctrl/Cmd + S: Save
      if (isMeta && event.key === 's') {
        event.preventDefault();
        if (handlers.onSave) {
          handlers.onSave();
        }
      }

      // Escape: Deselect (clear selected node)
      if (event.key === 'Escape') {
        event.preventDefault();
        // Could dispatch deselect action if needed
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers, undo, redo, canUndo, canRedo, deleteNode]);
};
