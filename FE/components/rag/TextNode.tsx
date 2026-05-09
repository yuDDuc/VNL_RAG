import React from 'react';
import { NodeProps } from 'reactflow';

export default function TextNode({ data }: NodeProps) {
  return (
    <div 
      className="nowheel" // add this so scroll events don't get trapped if we set overflow
      style={{
        width: '800px', 
        padding: '40px',
        backgroundColor: 'white',
        boxShadow: '0 0 10px rgba(0,0,0,0.05)',
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#333',
        whiteSpace: 'pre-wrap',
        cursor: 'text',
      }}
    >
      {data.content}
    </div>
  );
}
