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
    updateNode,
    selectedNodeId,
    selectedEdgeId,
    showToast,
  } = useGraphStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; flowX: number; flowY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  // Sync store to nodes/edges
  useEffect(() => {
    const newNodes = storeNodes.map(node => ({
      id: node.id,
      data: { ...node.data, type: node.type },
      position: node.position,
      type: node.type === 'table' ? 'tableNode' : 'legalNode',
      selected: node.id === selectedNodeId,
    }));
    setNodes(newNodes);
  }, [storeNodes, selectedNodeId, setNodes]);

  useEffect(() => {
    const newEdges = storeEdges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      label: edge.label,
      data: { label: edge.label },
      type: 'legalEdge',
      selected: edge.id === selectedEdgeId,
    }));
    setEdges(newEdges);
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
    if (selectedNodeId) {
      const node = storeNodes.find(n => n.id === selectedNodeId);
      if (node && window.confirm(`Delete node "${node.data.label}"?`)) {
        try {
          await nodeAPI.delete(selectedNodeId);
          const { deleteNode } = useGraphStore.getState();
          deleteNode(selectedNodeId);
        } catch (error) {
          console.error('Failed to delete node:', error);
        }
      }
    }
  };

  const onNodeDragStop = useCallback(
    async (_: any, node: Node) => {
      updateNode(node.id, { position: node.position });
      try {
        await nodeAPI.update(node.id, {
          x: node.position.x,
          y: node.position.y,
        });
      } catch (error) {
        console.error('Failed to update node position:', error);
      }
    },
    [updateNode]
  );

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
              <polygon points="0 0, 10 3.5, 0 7" fill="#999" />
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
