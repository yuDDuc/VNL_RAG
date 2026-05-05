import React from 'react';
import { useGraphStore } from '../../stores/graphStore';
import { useHistoryStore } from '../../stores/historyStore';
import { downloadJSON, exportToPNG, exportNodesToCSV, exportEdgesToCSV } from '../../lib/exportUtils';
import { graphAPI } from '../../lib/api';

const Toolbar: React.FC = () => {
  const { graphId, graphName, nodes, edges, setGraphName } = useGraphStore();
  const { undo, redo, canUndo, canRedo } = useHistoryStore();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSaveGraph = async () => {
    if (!graphId || !graphName) return;

    setIsSaving(true);
    try {
      await graphAPI.update(graphId, {
        name: graphName,
        description: `Graph with ${nodes.length} nodes and ${edges.length} edges`,
      });
      alert('Graph saved successfully!');
    } catch (error) {
      console.error('Failed to save graph:', error);
      alert('Failed to save graph');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportJSON = () => {
    const graph = { id: graphId || '', name: graphName, nodes, edges };
    downloadJSON(graph);
  };

  const handleExportPNG = () => {
    const svgElement = document.querySelector('.react-flow__renderer') as SVGSVGElement;
    exportToPNG(svgElement, graphName);
  };

  const handleExportNodesCSV = () => {
    const csv = exportNodesToCSV(nodes);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${graphName}-nodes.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportEdgesCSV = () => {
    const csv = exportEdgesToCSV(edges);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${graphName}-edges.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      padding: '10px 15px',
      backgroundColor: '#f5f5f5',
      borderBottom: '1px solid #ddd',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      flexWrap: 'wrap',
    }}>
      {/* Graph Name */}
      <input
        type="text"
        value={graphName}
        onChange={(e) => setGraphName(e.target.value)}
        placeholder="Graph name"
        style={{
          padding: '5px 10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px',
        }}
      />

      {/* Save Button */}
      <button
        onClick={handleSaveGraph}
        disabled={isSaving || !graphId}
        style={{
          padding: '6px 12px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        {isSaving ? 'Saving...' : 'Save'}
      </button>

      {/* Undo/Redo */}
      <button
        onClick={() => undo()}
        disabled={!canUndo()}
        title="Undo (Ctrl+Z)"
        style={{
          padding: '6px 12px',
          backgroundColor: canUndo() ? '#2196F3' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: canUndo() ? 'pointer' : 'not-allowed',
          fontSize: '14px',
        }}
      >
        ↶ Undo
      </button>

      <button
        onClick={() => redo()}
        disabled={!canRedo()}
        title="Redo (Ctrl+Shift+Z)"
        style={{
          padding: '6px 12px',
          backgroundColor: canRedo() ? '#2196F3' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: canRedo() ? 'pointer' : 'not-allowed',
          fontSize: '14px',
        }}
      >
        ↷ Redo
      </button>

      {/* Separator */}
      <div style={{ width: '1px', height: '24px', backgroundColor: '#ddd' }} />

      {/* Export Options */}
      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Export:</span>
        <button
          onClick={handleExportJSON}
          title="Export as JSON"
          style={{
            padding: '6px 10px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          JSON
        </button>
        <button
          onClick={handleExportPNG}
          title="Export as PNG"
          style={{
            padding: '6px 10px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          PNG
        </button>
        <button
          onClick={handleExportNodesCSV}
          title="Export nodes as CSV"
          style={{
            padding: '6px 10px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Nodes CSV
        </button>
        <button
          onClick={handleExportEdgesCSV}
          title="Export edges as CSV"
          style={{
            padding: '6px 10px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Edges CSV
        </button>
      </div>

      {/* Stats */}
      <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#666' }}>
        Nodes: {nodes.length} | Edges: {edges.length}
      </div>
    </div>
  );
};

export default Toolbar;
