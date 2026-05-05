import React from 'react';
import { Handle, Position } from 'reactflow';
import { useGraphStore } from '../../stores/graphStore';

interface CustomNodeProps {
  data: {
    label: string;
    content?: string;
    color?: string;
  };
  id: string;
  selected: boolean;
}

const CustomNode: React.FC<CustomNodeProps> = ({ data, id, selected }) => {
  const { selectNode } = useGraphStore();
  const color = data.color || '#607D8B'; // Default grey-blue

  return (
    <div
      onClick={() => selectNode(id)}
      style={{
        padding: '10px 15px',
        borderRadius: '8px',
        backgroundColor: 'white',
        border: `2px solid ${color}`,
        minWidth: '120px',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: selected ? `0 0 15px ${color}` : '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
    >
      {/* Handles at 4 cardinal points, both source and target to allow any connection */}
      <Handle type="target" position={Position.Top} id="ct-top" style={{ background: color }} />
      <Handle type="source" position={Position.Top} id="cs-top" style={{ background: color, opacity: 0 }} />
      
      <Handle type="target" position={Position.Bottom} id="ct-bottom" style={{ background: color }} />
      <Handle type="source" position={Position.Bottom} id="cs-bottom" style={{ background: color, opacity: 0 }} />
      
      <Handle type="target" position={Position.Left} id="ct-left" style={{ background: color }} />
      <Handle type="source" position={Position.Left} id="cs-left" style={{ background: color, opacity: 0 }} />
      
      <Handle type="target" position={Position.Right} id="ct-right" style={{ background: color }} />
      <Handle type="source" position={Position.Right} id="cs-right" style={{ background: color, opacity: 0 }} />

      <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', color: color, textTransform: 'uppercase' }}>
        {data.label}
      </div>
      {data.content && (
        <div style={{ fontSize: '10px', color: '#666', marginTop: '4px', fontStyle: 'italic' }}>
          {data.content}
        </div>
      )}
    </div>
  );
};

export default CustomNode;
