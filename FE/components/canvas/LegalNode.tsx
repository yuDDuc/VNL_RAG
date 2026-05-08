import React from 'react';
import { Handle, Position } from 'reactflow';
import { useGraphStore } from '../../stores/graphStore';

interface LegalNodeProps {
  data: {
    label: string;
    type?: string;
    content?: string;
    size?: number;
  };
  id: string;
  selected: boolean;
  isConnecting?: boolean;
}

const LegalNode: React.FC<LegalNodeProps> = ({ data, id, selected }) => {
  const { selectNode } = useGraphStore();
  const nodeSize = data.size || 80; // Mặc định 80px

  const typeColors: Record<string, string> = {
    '2 way edge': '#4CAF50', // Green
    'boolean': '#4CAF50',    // Backwards compatibility
    'buffer': '#2196F3',     // Blue (User requested Blue to be Buffer)
    'decree': '#2196F3',     // Backwards compatibility
    'orange_buffer': '#FF9800', // Moving the old orange buffer here
    'result': '#9C27B0',     // Purple
    'teleport': '#F44336',   // Red
    'section': '#00BCD4',
    'custom': '#9E9E9E',
  };

  const color = data.type ? typeColors[data.type] || '#757575' : '#757575';

  return (
    <div
      onClick={() => selectNode(id)}
      title={data.content}
      style={{
        width: `${nodeSize}px`,
        height: `${nodeSize}px`,
        borderRadius: '50%',
        backgroundColor: selected ? color : 'white',
        border: `2px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        cursor: 'pointer',
        fontSize: `${Math.max(10, nodeSize / 10)}px`,
        fontWeight: 'bold',
        color: selected ? 'white' : '#333',
        boxShadow: selected ? `0 0 12px ${color}` : '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        padding: '4px',
        overflow: 'hidden',
        wordBreak: 'break-word',
      }}
    >
      {/* Handles at 4 cardinal points, both source and target to allow any connection */}
      <Handle type="source" position={Position.Top} id="top" style={{ background: color, width: '8px', height: '8px' }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: color, width: '8px', height: '8px' }} />
      <Handle type="source" position={Position.Left} id="left" style={{ background: color, width: '8px', height: '8px' }} />
      <Handle type="source" position={Position.Right} id="right" style={{ background: color, width: '8px', height: '8px' }} />

      <div style={{ lineHeight: '1.2' }}>
        <div>{data.label}</div>
        {data.type && nodeSize > 60 && (
          <div style={{ fontSize: `${Math.max(8, nodeSize / 14)}px`, opacity: 0.8 }}>
            {data.type}
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalNode;
