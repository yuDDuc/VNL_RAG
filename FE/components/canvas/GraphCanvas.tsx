import React, { useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Connection,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  useReactFlow,
  ReactFlowProvider,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useGraphStore } from '../../stores/graphStore';
import { nodeAPI, edgeAPI } from '../../lib/api';
import LegalNodeComponent from './LegalNode';
import CustomNodeComponent from './CustomNode';
import TableNodeComponent from './TableNode';
import LegalEdge from './LegalEdge';
import ContextMenu from './ContextMenu';

const nodeTypes = {
  legalNode: LegalNodeComponent,
  customNode: CustomNodeComponent,
  tableNode: TableNodeComponent,
};

const edgeTypes = {
  legalEdge: LegalEdge,
};

const GraphCanvasContent: React.FC = () => {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    addNode,
    addEdge: addStoreEdge,
    selectNode,
    selectEdge,
    updateNodes,
    selectedNodeId,
    selectedEdgeId,
    showToast,
  } = useGraphStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; flowX: number; flowY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const { getNodes, getEdges } = useReactFlow();

  // Sync store to nodes/edges
  useEffect(() => {
    setNodes((nds) => {
      return storeNodes.map(node => {
        const existing = nds.find((n) => n.id === node.id);
        return {
          id: node.id,
          data: { ...node.data, type: node.type },
          position: node.position,
          type: (node.type === 'table' || node.type === 'table2d') ? 'tableNode' : 'legalNode',
          selected: node.id === selectedNodeId || (existing ? existing.selected : false),
        };
      });
    });
  }, [storeNodes, selectedNodeId, setNodes]);

  useEffect(() => {
    setEdges((eds) => {
      return storeEdges.map(edge => {
        const existing = eds.find((e) => e.id === edge.id);
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          label: edge.label,
          data: { label: edge.label, color: edge.color, content: edge.content },
          type: 'legalEdge',
          selected: edge.id === selectedEdgeId || (existing ? existing.selected : false),
        };
      });
    });
  }, [storeEdges, selectedEdgeId, setEdges]);

  const onConnect = useCallback(
    async (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      const graphId = useGraphStore.getState().graphId;
      if (!graphId) return;

      // Check if edge already exists
      const isDuplicate = storeEdges.some(
        (edge) =>
          edge.source === connection.source &&
          edge.target === connection.target &&
          edge.sourceHandle === connection.sourceHandle &&
          edge.targetHandle === connection.targetHandle
      );

      if (isDuplicate) return;

      try {
        const createdEdge = await edgeAPI.create({
          graph_id: graphId,
          source_node_id: connection.source,
          target_node_id: connection.target,
          relation_type: 'liên quan',
          source_handle: connection.sourceHandle || undefined,
          target_handle: connection.targetHandle || undefined,
        });

        const newEdge = {
          id: createdEdge.id,
          source: createdEdge.source_node_id,
          target: createdEdge.target_node_id,
          sourceHandle: createdEdge.source_handle,
          targetHandle: createdEdge.target_handle,
          label: createdEdge.relation_type,
        };

        addStoreEdge(newEdge);
      } catch (error) {
        console.error('Failed to create edge:', error);
      }
    },
    [addStoreEdge, storeEdges]
  );

  const onNodesDelete = useCallback(
    async (nodesToDelete: Node[]) => {
      const { deleteNode } = useGraphStore.getState();
      let successCount = 0;
      for (const node of nodesToDelete) {
        try {
          await nodeAPI.delete(node.id);
          deleteNode(node.id);
          successCount++;
        } catch (error) {
          console.error(`Failed to delete node ${node.id}:`, error);
          showToast(`Failed to delete node ${node.id}`, 'error');
        }
      }
      if (successCount > 0) {
        showToast(`Deleted ${successCount} node(s)`);
      }
    },
    [showToast]
  );

  const onEdgesDelete = useCallback(
    async (edgesToDelete: Edge[]) => {
      const { deleteEdge } = useGraphStore.getState();
      let successCount = 0;
      for (const edge of edgesToDelete) {
        try {
          await edgeAPI.delete(edge.id);
          deleteEdge(edge.id);
          successCount++;
        } catch (error) {
          console.error(`Failed to delete edge ${edge.id}:`, error);
          showToast(`Failed to delete relationship`, 'error');
        }
      }
      if (successCount > 0) {
        showToast(`Deleted ${successCount} relationship(s)`);
      }
    },
    [showToast]
  );

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    // If it's a drag (not a simple click), don't show menu
    // But for now, we'll keep it simple
    e.preventDefault();
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const flowPos = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      setContextMenu({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        flowX: flowPos.x,
        flowY: flowPos.y,
      });
    }
  }, [screenToFlowPosition]);

  const handleCreateNode = async (position: { flowX: number; flowY: number }, nodeType: string) => {
    setContextMenu(null);
    const nodeName = prompt(`Enter ${nodeType} name:`, `${nodeType}-${Date.now()}`);
    if (!nodeName || !useGraphStore.getState().graphId) return;

    try {
      const createdNode = await nodeAPI.create({
        graph_id: useGraphStore.getState().graphId!,
        type: nodeType,
        label: nodeName,
        x: position.flowX,
        y: position.flowY,
        content: '',
      });

      const newNode = {
        id: createdNode.id,
        type: createdNode.type,
        position: { x: createdNode.x, y: createdNode.y },
        data: {
          label: createdNode.label,
          content: createdNode.content,
        },
      };

      addNode(newNode);
    } catch (error) {
      console.error('Failed to create node:', error);
      showToast('Failed to save node to database', 'error');
    }
  };

  const handleDeleteNode = async () => {
    setContextMenu(null);
    const selectedNodes = getNodes().filter(n => n.selected);
    const selectedEdges = getEdges().filter(e => e.selected);

    if (selectedNodes.length === 0 && selectedEdges.length === 0) return;

    if (window.confirm(`Delete ${selectedNodes.length} nodes and ${selectedEdges.length} edges?`)) {
      await onNodesDelete(selectedNodes);
      await onEdgesDelete(selectedEdges);
    }
  };

  const onNodeDragStop = useCallback(
    async (_: any, node: Node) => {
      // If multiple nodes were dragged, update them all
      const selectedNodes = getNodes().filter(n => n.selected);
      const nodesToUpdate = selectedNodes.length > 1 ? selectedNodes : [node];

      // Update store atomically to avoid sync conflicts
      const updates = nodesToUpdate.map(n => ({
        id: n.id,
        data: { position: n.position }
      }));
      updateNodes(updates);

      // Update API
      for (const n of nodesToUpdate) {
        try {
          await nodeAPI.update(n.id, {
            x: n.position.x,
            y: n.position.y,
          });
        } catch (error) {
          console.error(`Failed to update node ${n.id} position:`, error);
        }
      }
    },
    [updateNodes, getNodes]
  );

  // Keyboard Shortcuts (Copy, Paste, Cut)
  const clipboard = useRef<{ type: string; label: string; content: string } | null>(null);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Don't trigger if typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const { selectedNodeId, nodes: storeNodes, graphId } = useGraphStore.getState();
      if (!graphId) return;

      // Copy (Ctrl+C)
      if (e.ctrlKey && e.key === 'c') {
        if (selectedNodeId) {
          const node = storeNodes.find(n => n.id === selectedNodeId);
          if (node) {
            clipboard.current = {
              type: node.type,
              label: node.data.label,
              content: node.data.content || '',
            };
            showToast(`Copied: ${node.data.label}`);
          }
        }
      }

      // Cut (Ctrl+X)
      if (e.ctrlKey && e.key === 'x') {
        if (selectedNodeId) {
          const node = storeNodes.find(n => n.id === selectedNodeId);
          if (node) {
            clipboard.current = {
              type: node.type,
              label: node.data.label,
              content: node.data.content || '',
            };
            try {
              const selectedNodes = getNodes().filter(n => n.selected);
              await onNodesDelete(selectedNodes);
              showToast(`Cut ${selectedNodes.length} node(s)`);
            } catch (error) {
              console.error('Failed to cut node:', error);
            }
          }
        }
      }

      // Paste (Ctrl+V)
      if (e.ctrlKey && e.key === 'v') {
        if (clipboard.current) {
          try {
            const pos = { x: 100, y: 100 };
            if (selectedNodeId) {
              const lastNode = storeNodes.find(n => n.id === selectedNodeId);
              if (lastNode) {
                pos.x = lastNode.position.x + 40;
                pos.y = lastNode.position.y + 40;
              }
            }

            const createdNode = await nodeAPI.create({
              graph_id: graphId,
              type: clipboard.current.type,
              label: `${clipboard.current.label} (copy)`,
              content: clipboard.current.content,
              x: pos.x,
              y: pos.y,
            });

            const newNode = {
              id: createdNode.id,
              type: createdNode.type,
              position: { x: createdNode.x, y: createdNode.y },
              data: {
                label: createdNode.label,
                content: createdNode.content,
              },
            };

            addNode(newNode);
            selectNode(newNode.id);
            showToast(`Pasted node`);
          } catch (error) {
            console.error('Failed to paste node:', error);
          }
        }
      }

      // Delete (Delete key)
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedNodes = getNodes().filter(n => n.selected);
        const selectedEdges = getEdges().filter(e => e.selected);
        if ((selectedNodes.length > 0 || selectedEdges.length > 0) && !e.ctrlKey) {
          handleDeleteNode();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addNode, selectNode, showToast, getNodes, getEdges, onNodesDelete, onEdgesDelete]);

  return (
    <div
      ref={canvasRef}
      onContextMenu={handleContextMenu}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={(_, node) => selectNode(node.id)}
        onEdgeClick={(_, edge) => selectEdge(edge.id)}
        onPaneClick={() => {
          selectNode(null);
          selectEdge(null);
          setContextMenu(null);
        }}
        connectionMode={ConnectionMode.Loose}
        selectionOnDrag={false}
        selectionKeyCode="Shift"
        panOnDrag={true}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
            </marker>
            <marker
              id="arrowhead-start"
              markerWidth="10"
              markerHeight="7"
              refX="1"
              refY="3.5"
              orient="auto"
            >
              <polygon points="10 0, 0 3.5, 10 7" fill="currentColor" />
            </marker>
          </defs>
        </svg>
      </ReactFlow>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onCreateNode={handleCreateNode}
          onDeleteNode={handleDeleteNode}
          onClose={() => setContextMenu(null)}
          contextPosition={contextMenu}
        />
      )}
    </div>
  );
};

const GraphCanvas: React.FC = () => (
  <ReactFlowProvider>
    <GraphCanvasContent />
  </ReactFlowProvider>
);

export default GraphCanvas;
