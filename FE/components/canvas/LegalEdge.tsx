import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';

const LegalEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const relationColors: Record<string, string> = {
    reference: '#2196F3',
    amend: '#FF9800',
    replace: '#f44336',
    base_on: '#9C27B0',
    guide: '#4CAF50',
    related: '#757575',
  };

  const color = data?.label ? relationColors[data.label] || '#757575' : '#757575';

  return (
    <>
      <path
        id={id}
        d={edgePath}
        stroke={selected ? color : '#ccc'}
        strokeWidth={selected ? 3 : 2}
        fill="none"
        strokeDasharray={data?.label === 'amend' ? '5,5' : 'none'}
        style={{
          transition: 'all 0.2s ease',
        }}
      />
      {data?.label && (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: '12px',
            fill: color,
            backgroundColor: 'white',
            fontWeight: 'bold',
            pointerEvents: 'none',
            textShadow: '0 0 2px white, 0 0 2px white',
          }}
        >
          {data.label}
        </text>
      )}
    </>
  );
};

export default LegalEdge;
