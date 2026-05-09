'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { graphAPI } from '../lib/api';
import { useGraphStore } from '../stores/graphStore';
import Toast from '../components/Toast';

interface GraphListItem {
  id: string;
  name: string;
  description?: string;
  type: 'legal' | 'rag';
  node_count: number;
  edge_count: number;
}

export default function Home() {
  const [graphs, setGraphs] = useState<GraphListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newGraphName, setNewGraphName] = useState('');
  const [newGraphType, setNewGraphType] = useState<'legal' | 'rag'>('legal');
  const [isCreating, setIsCreating] = useState(false);
  const { showToast } = useGraphStore();

  useEffect(() => {
    fetchGraphs();
  }, []);

  const fetchGraphs = async () => {
    try {
      setIsLoading(true);
      const res = await graphAPI.getAll();
      setGraphs(res.graphs || []);
    } catch (error) {
      console.error('Failed to fetch graphs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGraph = async () => {
    if (!newGraphName.trim()) {
      showToast('Please enter a name', 'error');
      return;
    }

    try {
      setIsCreating(true);
      const newGraph = await graphAPI.create({
        name: newGraphName,
        description: newGraphType === 'legal' ? 'New legal graph' : 'New RAG plan',
        type: newGraphType,
      });
      
      setNewGraphName('');
      showToast(`${newGraphType === 'legal' ? 'Graph' : 'RAG Plan'} created successfully!`);
      
      // Redirect to appropriate editor
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          const path = newGraphType === 'legal' ? 'graph' : 'rag';
          window.location.href = `/${path}/${newGraph.id}`;
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to create:', error);
      showToast('Failed to create', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteGraph = async (id: string, name: string) => {
    if (!window.confirm(`Delete graph "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await graphAPI.delete(id);
      setGraphs(graphs.filter(g => g.id !== id));
      showToast('Graph deleted successfully!');
    } catch (error) {
      console.error('Failed to delete graph:', error);
      showToast('Failed to delete graph', 'error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#2196F3',
        color: 'white',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
            📊 Legal Graph Editor
          </h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
            Create and manage relationships between legal documents
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '30px auto',
        padding: '0 20px',
      }}>
        {/* Create New Graph Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
            <div style={{ flex: 2, minWidth: '300px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Name</label>
              <input
                type="text"
                value={newGraphName}
                onChange={(e) => setNewGraphName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateGraph()}
                placeholder="e.g., Labor Law System"
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#666' }}>Type</label>
              <select
                value={newGraphType}
                onChange={(e) => setNewGraphType(e.target.value as 'legal' | 'rag')}
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                }}
              >
                <option value="legal">Legal Graph</option>
                <option value="rag">RAG Plan (Chunking)</option>
              </select>
            </div>
            <button
              onClick={handleCreateGraph}
              disabled={isCreating || !newGraphName.trim()}
              style={{
                padding: '10px 25px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isCreating ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                opacity: isCreating ? 0.6 : 1,
                height: '42px',
              }}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>

        {/* Graphs List */}
        <div>
          <h2 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Your Plans & Graphs</h2>
          
          {isLoading ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#999',
            }}>
              Loading...
            </div>
          ) : graphs.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '40px',
              textAlign: 'center',
              color: '#999',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <p>No projects yet. Create one to get started!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}>
              {graphs.map(graph => (
                <div
                  key={graph.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'box-shadow 0.2s ease',
                    position: 'relative',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    backgroundColor: graph.type === 'rag' ? '#E1F5FE' : '#E8F5E9',
                    color: graph.type === 'rag' ? '#0288D1' : '#2E7D32',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  }}>
                    {graph.type || 'legal'}
                  </div>

                  <h3 style={{
                    margin: '0 0 10px 0',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#2196F3',
                    paddingRight: '60px',
                  }}>
                    {graph.name}
                  </h3>
                  
                  <p style={{
                    margin: '0 0 15px 0',
                    fontSize: '13px',
                    color: '#666',
                    minHeight: '40px',
                  }}>
                    {graph.description || 'No description'}
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    fontSize: '12px',
                    color: '#999',
                    marginBottom: '15px',
                    borderBottom: '1px solid #eee',
                    paddingBottom: '10px',
                  }}>
                    {graph.type === 'rag' ? (
                      <span>📄 Chunks: {graph.node_count}</span>
                    ) : (
                      <>
                        <span>📌 Nodes: {graph.node_count}</span>
                        <span>🔗 Edges: {graph.edge_count}</span>
                      </>
                    )}
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '10px',
                  }}>
                    <Link
                      href={`/${graph.type === 'rag' ? 'rag' : 'graph'}/${graph.id}`}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        textAlign: 'center',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: 'bold',
                      }}
                    >
                      Open {graph.type === 'rag' ? 'RAG' : 'Graph'}
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGraph(graph.id, graph.name);
                      }}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '50px',
        padding: '20px',
        backgroundColor: '#f0f0f0',
        textAlign: 'center',
        fontSize: '12px',
        color: '#999',
        borderTop: '1px solid #ddd',
      }}>
        <p>Legal Graph Editor v1.0 | Visual Law System Development Tool</p>
      </footer>
      <Toast />
    </div>
  );
}
