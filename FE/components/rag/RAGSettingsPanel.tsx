'use client';

import React, { useState } from 'react';

interface RAGSettingsPanelProps {
  onAddChunk?: () => void;
}

export default function RAGSettingsPanel({ onAddChunk }: RAGSettingsPanelProps) {
  const [params, setParams] = useState({
    chunkSize: 500,
    chunkOverlap: 50,
    model: 'gpt-4o',
    embedding: 'text-embedding-3-small'
  });

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Model Options</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Chunking Params</label>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '11px', color: '#666' }}>Size</span>
            <input 
              type="number" 
              value={params.chunkSize}
              onChange={(e) => setParams({...params, chunkSize: parseInt(e.target.value)})}
              style={{ width: '100%', padding: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '11px', color: '#666' }}>Overlap</span>
            <input 
              type="number"
              value={params.chunkOverlap}
              onChange={(e) => setParams({...params, chunkOverlap: parseInt(e.target.value)})}
              style={{ width: '100%', padding: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <span style={{ fontSize: '11px', color: '#666' }}>Strategy</span>
          <select style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <option>Recursive Character</option>
            <option>Fixed Size</option>
            <option>Semantic Splitting</option>
            <option>Markdown Splitting</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>LLM Model</label>
        <select 
          value={params.model}
          onChange={(e) => setParams({...params, model: e.target.value})}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="gpt-4o">GPT-4o (OpenAI)</option>
          <option value="gpt-4-turbo">GPT-4 Turbo</option>
          <option value="claude-3-sonnet">Claude 3.5 Sonnet</option>
          <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
        </select>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Embedding Model</label>
        <select 
          value={params.embedding}
          onChange={(e) => setParams({...params, embedding: e.target.value})}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="text-embedding-3-small">text-embedding-3-small</option>
          <option value="text-embedding-3-large">text-embedding-3-large</option>
          <option value="cohere-multilingual-v3">Cohere Multilingual V3</option>
        </select>
      </div>

      <button style={{
        width: '100%',
        padding: '12px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginBottom: '10px'
      }}>
        RUN CHUNKING
      </button>
      
      <p style={{ fontSize: '11px', color: '#888', textAlign: 'center' }}>
        Click to automatically split the document into chunks based on current params.
      </p>

      <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>Manual Options</label>
        <button 
          onClick={onAddChunk}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'white',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px',
            fontSize: '13px'
          }}
        >
          ➕ Add Manual Chunk
        </button>
      </div>
    </div>
  );
}
