import React, { useCallback } from 'react';
import { NodeProps, NodeResizer, Handle, Position } from 'reactflow';
import { useGraphStore } from '../../stores/graphStore';
import { nodeAPI } from '../../lib/api';

const StickyNote: React.FC<NodeProps> = ({ id, data, selected }) => {
  const { updateNode } = useGraphStore();

  const onChange = useCallback((evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = evt.target.value;
    updateNode(id, { data: { ...data, content: newContent } });
    // Debounce or just call it (simple version)
    nodeAPI.update(id, { content: newContent });
  }, [id, data, updateNode]);

  const color = data.color || '#fff9c4'; // Default post-it yellow

  return (
    <div style={{
      padding: '10px',
      backgroundColor: color,
      border: '1px solid #e0d8a0',
      borderRadius: '2px',
      boxShadow: selected ? '0 4px 10px rgba(0,0,0,0.2)' : '0 2px 5px rgba(0,0,0,0.1)',
      width: data.width || 150,
      height: data.height || 150,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      <NodeResizer 
        minWidth={100} 
        minHeight={100} 
        isVisible={selected} 
        lineStyle={{ border: '1px solid #999' }}
        handleStyle={{ width: 8, height: 8, background: '#666' }}
        onResizeEnd={(evt, params) => {
          updateNode(id, { data: { ...data, width: params.width, height: params.height } });
          nodeAPI.update(id, { width: params.width, height: params.height });
        }}
      />
      
      {/* Small fold effect in corner */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: '0 0 15px 15px',
        borderColor: `transparent transparent rgba(0,0,0,0.1) transparent`,
      }} />

      <textarea
        value={data.content || ''}
        onChange={onChange}
        placeholder="Type idea here..."
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          border: 'none',
          resize: 'none',
          outline: 'none',
          fontSize: '13px',
          color: '#333',
          fontFamily: 'inherit',
          padding: '0',
          margin: '0',
          cursor: 'text',
        }}
        className="nodrag" // Prevents dragging node when typing
      />
      
      {/* We keep handles but make them invisible unless needed */}
      <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
      <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
    </div>
  );
};

export default StickyNote;
