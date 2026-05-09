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
      minWidth: '50px',
      minHeight: '30px'
    }}>
      <NodeResizer 
        isVisible={selected} 
        minWidth={50} 
        minHeight={30}
        handleStyle={{ width: 8, height: 8, background: '#2196F3' }}
      />
      
      {/* Label/ID Badge */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        left: 0,
        backgroundColor: '#2196F3',
        color: 'white',
        fontSize: '10px',
        padding: '2px 6px',
        borderRadius: '4px 4px 0 0',
        fontWeight: 'bold'
      }}>
        {data.label || `Chunk ${id.slice(0, 4)}`}
      </div>

      {/* Content Preview (Optional) */}
      <div style={{
        padding: '10px',
        fontSize: '11px',
        color: '#2196F3',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        opacity: 0.8
      }}>
        {data.content?.substring(0, 50)}...
      </div>
    </div>
  );
};

export default ChunkNode;
