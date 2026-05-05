import React, { useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useGraphStore } from '../../stores/graphStore';
import { nodeAPI, edgeAPI } from '../../lib/api';
import LegalNodeComponent from './LegalNode';
import LegalEdge from './LegalEdge';
import ContextMenu from './ContextMenu';

const nodeTypes = {
  legalNode: LegalNodeComponent,
};

const edgeTypes = {
  legalEdge: LegalEdge,
};

const GraphCanvas: React.FC = () => {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    addNode,
    addEdge: addStoreEdge,
    selectNode,
    updateNode,
    selectedNodeId,
  } = useGraphStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Sync store to nodes/edges
  useEffect(() => {
    const newNodes = storeNodes.map(node => ({
      id: node.id,
      data: node.data,
      position: node.position,
      type: 'legalNode',
      selected: node.id === selectedNodeId,
    }));
    setNodes(newNodes);
  }, [storeNodes, selectedNodeId, setNodes]);

  useEffect(() => {
    const newEdges = storeEdges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      type: 'legalEdge',
    }));
    setEdges(newEdges);
  }, [storeEdges, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;

      const newEdge = {
        id: `e-${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        label: 'related',
      };

      addStoreEdge(newEdge);
    },
    [addStoreEdge]
  );

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setContextMenu({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, []);

  const handleCreateNode = (position: { x: number; y: number }, nodeType: string) => {
    const nodeName = prompt(`Enter ${nodeType} name:`, `${nodeType}-${Date.now()}`);
    if (!nodeName) return;

    const newNode = {
      id: `node-${Date.now()}`,
      type: nodeType,
      position,
      data: {
        label: nodeName,
        content: '',
      },
    };

    addNode(newNode);
    setContextMenu(null);
  };

  const handleDeleteNode = () => {
    if (selectedNodeId && storeNodes.some(n => n.id === selectedNodeId)) {
      const node = storeNodes.find(n => n.id === selectedNodeId);
      if (node && window.confirm(`Delete node "${node.data.label}"?`)) {
        // This would require adding a deleteNode method to the store
        setContextMenu(null);
      }
    }
  };

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
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
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

export default GraphCanvas;
