import React, { useState } from 'react';
import { useGraphStore } from '../stores/graphStore';
import { nodeAPI, edgeAPI } from '../lib/api';

const DataTable: React.FC = () => {
  const { nodes, edges, updateNode, updateEdge, deleteNode, deleteEdge, showToast } = useGraphStore();
  const [activeTab, setActiveTab] = useState<'nodes' | 'edges'>('nodes');

  const handleDeleteNode = async (id: string) => {
    if (!window.confirm('Delete this node?')) return;
    try {
      await nodeAPI.delete(id);
      deleteNode(id);
      showToast('Node deleted');
    } catch (error) {
      console.error('Failed to delete node:', error);
      showToast('Failed to delete', 'error');
    }
  };

  const handleDeleteEdge = async (id: string) => {
    if (!window.confirm('Delete this relationship?')) return;
    try {
      await edgeAPI.delete(id);
      deleteEdge(id);
      showToast('Relationship deleted');
    } catch (error) {
      console.error('Failed to delete edge:', error);
      showToast('Failed to delete', 'error');
    }
  };

  const handleNodeChange = async (id: string, field: string, value: any) => {
    const node = nodes.find(n => n.id === id);
    if (!node) return;

    const updatedData = { ...node.data, [field]: value };
    const updatedType = field === 'type' ? value : node.type;

    try {
      updateNode(id, { 
        data: updatedData,
        type: updatedType
      });
      
      await nodeAPI.update(id, {
        label: field === 'label' ? value : node.data.label,
        content: field === 'content' ? value : node.data.content,
        type: updatedType,
      });
      // showToast('Updated successfully');
    } catch (error) {
      console.error('Failed to update node:', error);
      showToast('Failed to update', 'error');
    }
  };

  const handleEdgeChange = async (id: string, value: string) => {
    try {
      updateEdge(id, { label: value });
      await edgeAPI.update(id, { relation_type: value });
    } catch (error) {
      console.error('Failed to update edge:', error);
      showToast('Failed to update', 'error');
    }
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #ddd',
    }}>
      {/* Tabs */}
      <div style={{
        display: 'flex',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #ddd',
      }}>
        <button
          onClick={() => setActiveTab('nodes')}
          style={{
            padding: '12px 24px',
            border: 'none',
            backgroundColor: activeTab === 'nodes' ? 'white' : 'transparent',
            borderBottom: activeTab === 'nodes' ? '2px solid #2196F3' : 'none',
            color: activeTab === 'nodes' ? '#2196F3' : '#666',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          📄 Nodes (Entities)
        </button>
        <button
          onClick={() => setActiveTab('edges')}
          style={{
            padding: '12px 24px',
            border: 'none',
            backgroundColor: activeTab === 'edges' ? 'white' : 'transparent',
            borderBottom: activeTab === 'edges' ? '2px solid #2196F3' : 'none',
            color: activeTab === 'edges' ? '#2196F3' : '#666',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          🔗 Edges (Relationships)
        </button>
      </div>

      {/* Table Container */}
      <div style={{ flex: 1, overflow: 'auto', padding: '1px' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px',
          textAlign: 'left',
        }}>
          <thead style={{
            position: 'sticky',
            top: 0,
            backgroundColor: '#f1f3f5',
            zIndex: 1,
          }}>
            <tr>
              {activeTab === 'nodes' ? (
                <>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Label</th>
                  <th style={thStyle}>Content</th>
                  <th style={thStyle}>Position (X, Y)</th>
                  <th style={thStyle}>Actions</th>
                </>
              ) : (
                <>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Source</th>
                  <th style={thStyle}>Relation</th>
                  <th style={thStyle}>Target</th>
                  <th style={thStyle}>Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {activeTab === 'nodes' ? (
              nodes.map(node => (
                <tr key={node.id} style={trStyle}>
                  <td style={tdStyle} title={node.id}>{node.id.substring(0, 8)}...</td>
                  <td style={tdStyle}>
                    <select
                      value={node.type}
                      onChange={(e) => handleNodeChange(node.id, 'type', e.target.value)}
                      style={inputStyle}
                    >
                      {['law', 'decree', 'circular', 'article', 'clause', 'section', 'table', 'custom'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={node.data.label}
                      onChange={(e) => handleNodeChange(node.id, 'label', e.target.value)}
                      style={inputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    <textarea
                      value={node.data.content || ''}
                      onChange={(e) => handleNodeChange(node.id, 'content', e.target.value)}
                      style={{ ...inputStyle, minHeight: '30px', resize: 'vertical' }}
                    />
                  </td>
                  <td style={tdStyle}>
                    {Math.round(node.position.x)}, {Math.round(node.position.y)}
                  </td>
                  <td style={tdStyle}>
                    <button 
                      onClick={() => handleDeleteNode(node.id)}
                      style={{ border: 'none', background: 'none', color: 'red', cursor: 'pointer' }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              edges.map(edge => (
                <tr key={edge.id} style={trStyle}>
                  <td style={tdStyle} title={edge.id}>{edge.id.substring(0, 8)}...</td>
                  <td style={tdStyle}>
                    {nodes.find(n => n.id === edge.source)?.data.label || edge.source}
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={edge.label}
                      onChange={(e) => handleEdgeChange(edge.id, e.target.value)}
                      style={inputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    {nodes.find(n => n.id === edge.target)?.data.label || edge.target}
                  </td>
                  <td style={tdStyle}>
                    <button 
                      onClick={() => handleDeleteEdge(edge.id)}
                      style={{ border: 'none', background: 'none', color: 'red', cursor: 'pointer' }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {(activeTab === 'nodes' ? nodes.length : edges.length) === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
            No {activeTab} found in this graph.
          </div>
        )}
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  padding: '12px 15px',
  borderBottom: '2px solid #ddd',
  color: '#444',
  fontWeight: '600',
};

const tdStyle: React.CSSProperties = {
  padding: '8px 15px',
  borderBottom: '1px solid #eee',
  verticalAlign: 'top',
};

const trStyle: React.CSSProperties = {
  transition: 'background-color 0.1s',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 8px',
  border: '1px solid transparent',
  borderRadius: '4px',
  fontSize: '13px',
  backgroundColor: 'transparent',
  outline: 'none',
  transition: 'all 0.2s',
};


export default DataTable;
