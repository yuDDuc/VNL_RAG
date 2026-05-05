import React, { useState } from 'react';
import { useGraphStore } from '../../stores/graphStore';

const NODE_TYPES = ['law', 'decree', 'circular', 'article', 'clause', 'section'];
const RELATION_TYPES = ['reference', 'amend', 'replace', 'base_on', 'guide', 'related'];

const NodeDetailPanel: React.FC = () => {
  const { nodes, edges, selectedNodeId, selectedEdgeId, updateNode, updateEdge } = useGraphStore();

  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;
  const selectedEdge = selectedEdgeId ? edges.find(e => e.id === selectedEdgeId) : null;

  const [nodeLabel, setNodeLabel] = useState(selectedNode?.data.label || '');
  const [nodeContent, setNodeContent] = useState(selectedNode?.data.content || '');
  const [nodeType, setNodeType] = useState(selectedNode?.type || 'article');
  const [nodeSize, setNodeSize] = useState(selectedNode?.data.size || 80);

  const [edgeLabel, setEdgeLabel] = useState(selectedEdge?.label || '');

  const handleSaveNode = () => {
    if (selectedNodeId) {
      updateNode(selectedNodeId, {
        data: {
          label: nodeLabel,
          content: nodeContent,
          size: nodeSize,
        },
        type: nodeType,
      });
    }
  };

  const handleSaveEdge = () => {
    if (selectedEdgeId) {
      updateEdge(selectedEdgeId, {
        label: edgeLabel,
      });
    }
  };

  React.useEffect(() => {
    if (selectedNode) {
      setNodeLabel(selectedNode.data.label);
      setNodeContent(selectedNode.data.content || '');
      setNodeType(selectedNode.type);
      setNodeSize(selectedNode.data.size || 80);
    }
  }, [selectedNode]);

  React.useEffect(() => {
    if (selectedEdge) {
      setEdgeLabel(selectedEdge.label || '');
    }
  }, [selectedEdge]);

  if (!selectedNode && !selectedEdge) {
    return (
      <div style={{
        padding: '15px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#999',
        textAlign: 'center',
      }}>
        Select a node or edge to view details
      </div>
    );
  }

  if (selectedNode) {
    return (
      <div style={{
        padding: '15px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold' }}>
          Node Details
        </h3>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
            Label
          </label>
          <input
            type="text"
            value={nodeLabel}
            onChange={(e) => setNodeLabel(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '13px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
            Type
          </label>
          <select
            value={nodeType}
            onChange={(e) => setNodeType(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '13px',
              boxSizing: 'border-box',
            }}
          >
            {NODE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
            Size: {nodeSize}px
          </label>
          <input
            type="range"
            min="40"
            max="200"
            value={nodeSize}
            onChange={(e) => setNodeSize(parseInt(e.target.value))}
            style={{
              width: '100%',
              cursor: 'pointer',
            }}
          />
          <div style={{ fontSize: '11px', color: '#999', marginTop: '5px' }}>
            Min: 40px | Max: 200px
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
            Content
          </label>
          <textarea
            value={nodeContent}
            onChange={(e) => setNodeContent(e.target.value)}
            placeholder="Node description or content..."
            style={{
              width: '100%',
              height: '100px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '13px',
              fontFamily: 'monospace',
              boxSizing: 'border-box',
              resize: 'vertical',
            }}
          />
        </div>

        <button
          onClick={handleSaveNode}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          Save Node
        </button>
      </div>
    );
  }

  if (selectedEdge) {
    return (
      <div style={{
        padding: '15px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold' }}>
          Edge Details
        </h3>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
            Relation Type
          </label>
          <select
            value={edgeLabel}
            onChange={(e) => setEdgeLabel(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '13px',
              boxSizing: 'border-box',
            }}
          >
            <option value="">-- Select relation --</option>
            {RELATION_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div style={{
          marginBottom: '12px',
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#666',
        }}>
          <div>From: {selectedEdge.source}</div>
          <div>To: {selectedEdge.target}</div>
        </div>

        <button
          onClick={handleSaveEdge}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          Save Edge
        </button>
      </div>
    );
  }

  return null;
};

export default NodeDetailPanel;
