'use client';

import React from 'react';
import { NodeProps, NodeResizer } from 'reactflow';

const ChunkNode: React.FC<NodeProps> = ({ id, data, selected }) => {
  const width = data.width || 200;
  const height = data.height || 100;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      border: selected ? '2px solid #2196F3' : '1px solid rgba(33, 150, 243, 0.4)',
      backgroundColor: selected ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.05)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      minWidth: '20px',
      minHeight: '10px'
    }}>
      <NodeResizer 
        isVisible={selected} 
        minWidth={20} 
        minHeight={10}
        handleStyle={{ width: 8, height: 8, background: '#2196F3' }}
      />
    </div>
  );
};

export default ChunkNode;
