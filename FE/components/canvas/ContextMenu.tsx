import React, { useEffect, useRef } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  contextPosition: { x: number; y: number; flowX: number; flowY: number };
  onCreateNode: (position: { flowX: number; flowY: number }, nodeType: string) => void;
  onDeleteNode: () => void;
  onClose: () => void;
}

const NODE_TYPES = [
  { id: 'custom', label: 'Node' },
  { id: 'table', label: 'Table' }
];

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  contextPosition,
  onCreateNode,
  onDeleteNode,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 1000,
        minWidth: '150px',
      }}
    >
      <div style={{ padding: '5px 0' }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 'bold',
          padding: '8px 12px',
          color: '#666',
          borderBottom: '1px solid #eee',
        }}>
          Create Node
        </div>
        {NODE_TYPES.map(type => (
          <button
            key={type.id}
            onClick={() => onCreateNode(contextPosition, type.id)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '8px 12px',
              border: 'none',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          >
            → {type.label}
          </button>
        ))}

        <div style={{
          borderTop: '1px solid #eee',
          padding: '5px 0',
        }}>
          <button
            onClick={onDeleteNode}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '8px 12px',
              border: 'none',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '13px',
              color: '#f44336',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ffebee')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          >
            Delete Selected
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContextMenu;
