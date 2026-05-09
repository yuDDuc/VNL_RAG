'use client';

import React, { useState } from 'react';

interface RAGSettingsPanelProps {
  onAddChunk?: () => void;
  onUploadText?: (text: string) => void;
}

export default function RAGSettingsPanel({ onAddChunk, onUploadText }: RAGSettingsPanelProps) {
  const [params, setParams] = useState({
    chunkSize: 500,
    chunkOverlap: 50,
    model: 'gpt-4o',
    embedding: 'text-embedding-3-small'
  });
  const [tempText, setTempText] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // For txt files, read locally
    if (file.name.toLowerCase().endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (onUploadText) onUploadText(content);
      };
      reader.readAsText(file);
      return;
    }

    // For other files, send to backend
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Use the environment variable or default to localhost:8000
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/upload/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Upload failed');
      }

      const data = await response.json();
      if (onUploadText && data.content) {
        onUploadText(data.content);
      }
    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert('Error extracting text: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>RAG Settings</h3>

      {/* Document Source Section */}
      <div style={{ marginBottom: '30px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>📂 Document Source</label>
        
        <div style={{ marginBottom: '15px' }}>
          <span style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '5px' }}>Upload file (.txt, .pdf, .docx, images)</span>
          <input 
            type="file" 
            accept=".txt,.pdf,.docx,.png,.jpg,.jpeg" 
            onChange={handleFileUpload}
            style={{ fontSize: '12px', width: '100%' }}
          />
        </div>

        <div>
          <span style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '5px' }}>Or paste text</span>
          <textarea 
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            placeholder="Paste text here..."
            style={{ 
              width: '100%', 
              height: '80px', 
              padding: '8px', 
              fontSize: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              marginBottom: '10px'
            }}
          />
          <button 
            onClick={() => {
              if (tempText.trim() && onUploadText) {
                onUploadText(tempText);
                setTempText('');
              }
            }}
            style={{
              width: '100%',
              padding: '6px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Update Text
          </button>
        </div>
      </div>
      
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
