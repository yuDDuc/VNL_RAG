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
  source,
  target,
}) => {
  const isSelfLoop = source === target;

  let [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  if (isSelfLoop) {
    // Custom round loop path for self-connections
    const loopSize = 50;
    // An arc-like path that goes out and back
    edgePath = `M ${sourceX} ${sourceY} C ${sourceX + loopSize} ${sourceY - loopSize} ${sourceX - loopSize} ${sourceY - loopSize} ${sourceX} ${sourceY}`;
    labelX = sourceX;
    labelY = sourceY - loopSize;
  }

  const relationColors: Record<string, string> = {
    '2 way': '#4CAF50',
    'buffer': '#2196F3',
    'hướng dẫn': '#4CAF50',
    'quy định chi tiết': '#2196F3',
    'sửa đổi': '#FF9800',
    'bổ sung': '#FF5722',
    'bãi bỏ': '#f44336',
    'hợp nhất': '#9C27B0',
    'liên quan': '#757575',
    'tùy chỉnh': '#607D8B',
  };

  const color = data?.color || (data?.label ? relationColors[data.label] || '#757575' : '#757575');
  const isBidirectional = data?.label === '2 way';

  return (
    <>
      {/* Interaction path - wider invisible path to make clicking easier */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: 'pointer' }}
      />
      <path
        id={id}
        d={edgePath}
        stroke={selected ? color : '#999'}
        strokeWidth={selected ? 3 : 1.5}
        fill="none"
        markerEnd="url(#arrowhead)"
        markerStart={isBidirectional ? "url(#arrowhead-start)" : "none"}
        strokeDasharray={data?.label === 'amend' ? '5,5' : 'none'}
        style={{
          transition: 'all 0.2s ease',
          filter: selected ? `drop-shadow(0 0 5px ${color})` : 'none',
          pointerEvents: 'none', // Path itself shouldn't capture events, let interaction path do it
        }}
      />
      {data?.label && (
        <foreignObject
          width={80}
          height={20}
          x={labelX - 40}
          y={labelY - 10}
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}>
            <span style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.8)',
              color: color,
              fontWeight: 'bold',
              border: `1px solid ${color}`,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              {data.label}
            </span>
          </div>
        </foreignObject>
      )}
    </>
  );
};

export default LegalEdge;
