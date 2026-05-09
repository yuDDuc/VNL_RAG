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
      borderRadius: '4px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      minWidth: '20px',
      minHeight: '20px'
    }}>
      <NodeResizer 
        isVisible={selected} 
        minWidth={20} 
        minHeight={20}
        handleStyle={{ width: 8, height: 8, background: '#2196F3' }}
      />
      
      {/* Label/ID Badge */}
      <div style={{
        position: 'absolute',
        top: '-15px',
        left: '-1px',
        backgroundColor: '#2196F3',
        color: 'white',
        fontSize: '9px',
        padding: '1px 4px',
        borderRadius: '2px 2px 0 0',
        fontWeight: 'bold',
        whiteSpace: 'nowrap'
      }}>
        {data.label || `Chunk ${id.slice(0, 4)}`}
      </div>
    </div>
  );
};

export default ChunkNode;
