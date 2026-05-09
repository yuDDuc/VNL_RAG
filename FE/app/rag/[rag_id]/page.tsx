'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ReactFlow, { 
  Background, 
  Controls, 
  Panel,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { graphAPI, nodeAPI } from '../../../lib/api';
import RAGSettingsPanel from '../../../components/rag/RAGSettingsPanel';
import ChunkNode from '../../../components/rag/ChunkNode';

const nodeTypes = {
  chunk: ChunkNode,
};

export default function RAGWorkspace() {
  const { rag_id } = useParams();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [ragPlan, setRagPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState('Nội dung văn bản sẽ hiển thị ở đây để bạn thực hiện chunking...\n\nĐiều 1: Phạm vi điều chỉnh\nLuật này quy định về việc quản lý và sử dụng tài sản công tại cơ quan nhà nước...\n\nĐiều 2: Đối tượng áp dụng\n1. Cơ quan nhà nước.\n2. Đơn vị vũ trang nhân dân.\n3. Đơn vị sự nghiệp công lập.');

  useEffect(() => {
    if (rag_id) {
      fetchRAGPlan();
    }
  }, [rag_id]);

  const fetchRAGPlan = async () => {
    try {
      setIsLoading(true);
      const data = await graphAPI.getOne(rag_id as string);
      setRagPlan(data);
      if (data.content) {
        setText(data.content);
      }
      
      // Load nodes (chunks)
      const initialNodes = data.nodes.map((n: any) => ({
        id: n.id,
        type: 'chunk',
        position: { x: n.x, y: n.y },
        data: { 
          label: n.label,
          content: n.content,
          width: n.width || 200,
          height: n.height || 25
        },
      }));
      setNodes(initialNodes);
    } catch (error) {
      console.error('Failed to fetch RAG plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onAddChunk = React.useCallback(async () => {
    if (!rag_id) return;
    
    try {
      const newNode = await nodeAPI.create({
        graph_id: rag_id as string,
        type: 'chunk',
        label: `Chunk ${nodes.length + 1}`,
        x: 100,
        y: 100,
        width: 200,
        height: 25
      });

      setNodes((nds) => nds.concat({
        id: newNode.id,
        type: 'chunk',
        position: { x: newNode.x, y: newNode.y },
        data: { 
          label: newNode.label,
          width: newNode.width,
          height: newNode.height
        },
      }));
    } catch (error) {
      console.error('Failed to add chunk:', error);
    }
  }, [rag_id, nodes, setNodes]);

  const onUploadText = React.useCallback(async (newContent: string) => {
    if (!rag_id) return;
    try {
      await graphAPI.update(rag_id as string, { content: newContent });
      setText(newContent);
    } catch (error) {
      console.error('Failed to upload text:', error);
    }
  }, [rag_id]);

  if (isLoading) return <div style={{ padding: 20 }}>Loading RAG Workspace...</div>;

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header style={{ 
        height: '60px', 
        backgroundColor: '#1E88E5', 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 20px',
        justifyContent: 'space-between'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px' }}>🚀 RAG Plan: {ragPlan?.name}</h2>
        </div>
        <div>
          <button style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
            Save Changes
          </button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Main Content Area */}
        <div style={{ flex: 1, position: 'relative', backgroundColor: '#fafafa' }}>
          {/* Text Background Container */}
          <div style={{ 
            position: 'absolute', 
            top: 50, 
            left: 50, 
            right: 50, 
            bottom: 50,
            padding: '40px',
            backgroundColor: 'white',
            boxShadow: '0 0 10px rgba(0,0,0,0.05)',
            overflow: 'auto',
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#333',
            whiteSpace: 'pre-wrap',
            zIndex: 0
          }}>
            {text}
          </div>

          {/* React Flow Overlay for Bounding Boxes */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              style={{ background: 'transparent' }}
            >
              <Background color="#aaa" gap={20} />
              <Controls />
              <Panel position="top-left" style={{ backgroundColor: 'white', padding: '5px 10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                Mode: Manual Chunking
              </Panel>
            </ReactFlow>
          </div>
        </div>

        {/* Right Sidebar: Settings */}
        <div style={{ width: '350px', borderLeft: '1px solid #ddd', backgroundColor: 'white', overflowY: 'auto' }}>
          <RAGSettingsPanel onAddChunk={onAddChunk} onUploadText={onUploadText} />
        </div>
      </div>
    </div>
  );
}
