import React from 'react';
import { Handle, Position } from 'reactflow';
import { useGraphStore } from '../../stores/graphStore';

interface TableNodeProps {
  id: string;
  data: {
    label: string;
    content?: string;
    size?: number;
  };
  selected: boolean;
}

const TableNode: React.FC<TableNodeProps> = ({ id, data, selected }) => {
  const { selectNode } = useGraphStore();
  const nodeSize = data.size || 150; // Table nodes are bigger by default

  let tableData = { headers: ['Column 1', 'Column 2'], rows: [['Value 1', 'Value 2']] };
  try {
    if (data.content && data.content.startsWith('{')) {
      tableData = JSON.parse(data.content);
    }
  } catch (e) {
    console.error('Failed to parse table data:', e);
  }

  const color = '#607D8B'; // Blue Grey

  return (
    <div
      onClick={() => selectNode(id)}
      style={{
        minWidth: `${nodeSize}px`,
        minHeight: `${nodeSize * 0.6}px`,
        backgroundColor: 'white',
        border: `2px solid ${selected ? '#2196F3' : color}`,
        borderRadius: '4px',
        boxShadow: selected ? '0 0 10px rgba(33, 150, 243, 0.5)' : '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div style={{
        backgroundColor: color,
        color: 'white',
        padding: '4px 8px',
        fontSize: '11px',
        fontWeight: 'bold',
        textAlign: 'center',
      }}>
        {data.label}
      </div>
      
      <div style={{ flex: 1, padding: '4px', overflow: 'hidden' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '9px',
        }}>
          <thead>
            <tr>
              {tableData.headers.map((h, i) => (
                <th key={i} style={{ border: '1px solid #ddd', padding: '2px', backgroundColor: '#f5f5f5' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.rows.slice(0, 5).map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{ border: '1px solid #ddd', padding: '2px' }}>{cell}</td>
                ))}
              </tr>
            ))}
            {tableData.rows.length > 5 && (
              <tr>
                <td colSpan={tableData.headers.length} style={{ textAlign: 'center', color: '#999' }}>
                  ... {tableData.rows.length - 5} more rows
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Handle type="source" position={Position.Top} id="top" style={{ background: color, width: '8px', height: '8px' }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: color, width: '8px', height: '8px' }} />
      <Handle type="source" position={Position.Left} id="left" style={{ background: color, width: '8px', height: '8px' }} />
      <Handle type="source" position={Position.Right} id="right" style={{ background: color, width: '8px', height: '8px' }} />
    </div>
  );
};

export default TableNode;
