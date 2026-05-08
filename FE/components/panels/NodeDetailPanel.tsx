import React, { useState } from 'react';
import { useGraphStore } from '../../stores/graphStore';
import { nodeAPI, edgeAPI } from '../../lib/api';

const RELATION_TYPES = ['2 way', 'buffer', 'sửa đổi', 'bổ sung', 'bãi bỏ', 'hợp nhất', 'liên quan', 'tùy chỉnh'];

const NodeDetailPanel: React.FC = () => {
  const {
    nodes,
    edges,
    selectedNodeId,
    selectedEdgeId,
    updateNode,
    updateEdge,
    deleteNode,
    deleteEdge,
    showToast
  } = useGraphStore();

  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;
  const selectedEdge = selectedEdgeId ? edges.find(e => e.id === selectedEdgeId) : null;

  const [nodeLabel, setNodeLabel] = useState(selectedNode?.data.label || '');
  const [nodeContent, setNodeContent] = useState(selectedNode?.data.content || '');
  const [nodeType, setNodeType] = useState(selectedNode?.type || 'article');
  const [nodeSize, setNodeSize] = useState(selectedNode?.data.size || 80);
  const [tableData, setTableData] = useState<{ headers: string[], rows: string[][] }>({
    headers: ['Column 1', 'Column 2'],
    rows: [['Value 1', 'Value 2']]
  });

  const addRow = () => {
    const newRows = [...tableData.rows, Array(tableData.headers.length).fill('')];
    updateTable(tableData.headers, newRows);
  };

  const addColumn = () => {
    const newHeaders = [...tableData.headers, `Column ${tableData.headers.length + 1}`];
    const newRows = tableData.rows.map(row => [...row, '']);
    updateTable(newHeaders, newRows);
  };

  const removeRow = (index: number) => {
    if (tableData.rows.length <= 1) return;
    const newRows = tableData.rows.filter((_, i) => i !== index);
    updateTable(tableData.headers, newRows);
  };

  const removeColumn = (index: number) => {
    if (tableData.headers.length <= 1) return;
    const newHeaders = tableData.headers.filter((_, i) => i !== index);
    const newRows = tableData.rows.map(row => row.filter((_, i) => i !== index));
    updateTable(newHeaders, newRows);
  };

  const updateTableCell = (ri: number, ci: number, value: string) => {
    const newRows = [...tableData.rows];
    newRows[ri] = [...newRows[ri]];
    newRows[ri][ci] = value;
    updateTable(tableData.headers, newRows);
  };

  const updateTableHeader = (ci: number, value: string) => {
    const newHeaders = [...tableData.headers];
    newHeaders[ci] = value;
    updateTable(newHeaders, tableData.rows);
  };

  const updateTable = (headers: string[], rows: string[][]) => {
    const newData = { headers, rows };
    setTableData(newData);
    setNodeContent(JSON.stringify(newData));
  };

  const [edgeLabel, setEdgeLabel] = useState(selectedEdge?.label || '');

  const handleSaveNode = async () => {
    if (selectedNodeId) {
      try {
        await nodeAPI.update(selectedNodeId, {
          label: nodeLabel,
          content: nodeContent,
          type: nodeType,
        });

        updateNode(selectedNodeId, {
          data: {
            label: nodeLabel,
            content: nodeContent,
            size: nodeSize,
          },
          type: nodeType,
        });
        showToast('Node saved successfully');
      } catch (error) {
        console.error('Failed to save node:', error);
        showToast('Failed to save node to database', 'error');
      }
    }
  };

  const handleSaveEdge = async () => {
    if (selectedEdgeId) {
      try {
        await edgeAPI.update(selectedEdgeId, {
          relation_type: edgeLabel,
        });

        updateEdge(selectedEdgeId, {
          label: edgeLabel,
        });
        showToast('Edge saved successfully');
      } catch (error) {
        console.error('Failed to save edge:', error);
        showToast('Failed to save edge to database', 'error');
      }
    }
  };

  const handleDeleteEdge = async () => {
    if (selectedEdgeId && window.confirm('Are you sure you want to delete this relationship?')) {
      try {
        await edgeAPI.delete(selectedEdgeId);
        deleteEdge(selectedEdgeId);
      } catch (error) {
        console.error('Failed to delete edge:', error);
      }
    }
  };

  const handleDeleteNode = async () => {
    if (selectedNodeId && window.confirm('Are you sure you want to delete this node and all its connections?')) {
      try {
        await nodeAPI.delete(selectedNodeId);
        deleteNode(selectedNodeId);
      } catch (error) {
        console.error('Failed to delete node:', error);
      }
    }
  };

  React.useEffect(() => {
    if (selectedNode) {
      setNodeLabel(selectedNode.data.label);
      setNodeContent(selectedNode.data.content || '');
      setNodeType(selectedNode.type);
      setNodeSize(selectedNode.data.size || 80);

      if (selectedNode.type === 'table' || selectedNode.type === 'table2d') {
        try {
          if (selectedNode.data.content && selectedNode.data.content.startsWith('{')) {
            setTableData(JSON.parse(selectedNode.data.content));
          } else {
            setTableData({ headers: ['Column 1', 'Column 2'], rows: [['', '']] });
          }
        } catch (e) {
          setTableData({ headers: ['Column 1', 'Column 2'], rows: [['', '']] });
        }
      }
    }
  }, [selectedNode]);

  React.useEffect(() => {
    if (selectedEdge) {
      setEdgeLabel(selectedEdge.label || '');
    }
  }, [selectedEdge]);

  return (
    <>
      {!selectedNode && !selectedEdge && (
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
      )}

      {selectedNode && (
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
              <option value="custom">Generic Node</option>
              <option value="2 way edge">2 way edge (Green)</option>
              <option value="buffer">Buffer (Blue)</option>
              <option value="orange_buffer">Secondary Buffer (Orange)</option>
              <option value="result">Result (Purple)</option>
              <option value="teleport">Teleport (Red)</option>
              <option value="section">OnWorking (Cyan)</option>
              <option value="table">Table 1D (List)</option>
              <option value="table2d">Table 2D (Matrix)</option>
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
            {(nodeType === 'table' || nodeType === 'table2d') ? (
              <div style={{
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '10px',
                backgroundColor: '#f8f9fa',
              }}>
                <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                  <button onClick={addRow} style={tableBtnStyle}>+ Row</button>
                  <button onClick={addColumn} style={tableBtnStyle}>+ Col</button>
                </div>

                <div style={{ overflowX: 'auto', maxHeight: '300px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr>
                        {tableData.headers.map((h, ci) => (
                          <th key={ci} style={{ border: '1px solid #ddd', padding: '4px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <input
                                value={h}
                                onChange={(e) => updateTableHeader(ci, e.target.value)}
                                style={{ width: '100%', border: 'none', background: 'transparent', fontWeight: 'bold', textAlign: 'center' }}
                              />
                              <button onClick={() => removeColumn(ci)} style={{ fontSize: '9px', color: 'red', border: 'none', background: 'transparent', cursor: 'pointer' }}>×</button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.rows.map((row, ri) => (
                        <tr key={ri}>
                          {row.map((cell, ci) => (
                            <td key={ci} style={{ border: '1px solid #ddd', padding: '4px' }}>
                              <input
                                value={cell}
                                onChange={(e) => updateTableCell(ri, ci, e.target.value)}
                                style={{ width: '100%', border: 'none', background: 'transparent' }}
                              />
                            </td>
                          ))}
                          <td style={{ border: 'none', padding: '4px' }}>
                            <button onClick={() => removeRow(ri)} style={{ fontSize: '12px', color: 'red', border: 'none', background: 'transparent', cursor: 'pointer' }}>×</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <textarea
                value={nodeContent}
                onChange={(e) => setNodeContent(e.target.value)}
                placeholder="Node description or content..."
                style={{
                  width: '100%',
                  height: '120px',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={handleSaveNode}
              style={{
                flex: 2,
                padding: '10px',
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
            <button
              onClick={handleDeleteNode}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {selectedEdge && (
        <div style={{
          padding: '15px',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
              Edge Details
            </h3>
            <button
              onClick={() => useGraphStore.getState().selectEdge(null)}
              style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px', color: '#999' }}
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
              Relation Name / Function
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={edgeLabel}
                onChange={(e) => setEdgeLabel(e.target.value)}
                placeholder="e.g., references, amends, based on..."
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  marginBottom: '8px',
                }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {RELATION_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setEdgeLabel(type)}
                    style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      border: '1px solid #ddd',
                      backgroundColor: edgeLabel === type ? '#2196F3' : '#f0f0f0',
                      color: edgeLabel === type ? 'white' : '#666',
                      cursor: 'pointer',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            marginBottom: '12px',
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            fontSize: '11px',
            color: '#666',
            border: '1px solid #eee',
          }}>
            <div style={{ marginBottom: '4px' }}>
              <strong>Source:</strong> {nodes.find(n => n.id === selectedEdge.source)?.data.label || selectedEdge.source}
            </div>
            <div>
              <strong>Target:</strong> {nodes.find(n => n.id === selectedEdge.target)?.data.label || selectedEdge.target}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={handleSaveEdge}
              style={{
                flex: 2,
                padding: '10px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1976D2')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2196F3')}
            >
              Update Relation
            </button>
            <button
              onClick={handleDeleteEdge}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}

    </>
  );
};

const tableBtnStyle: React.CSSProperties = {
  padding: '4px 8px',
  fontSize: '11px',
  backgroundColor: '#f0f0f0',
  border: '1px solid #ccc',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default NodeDetailPanel;
