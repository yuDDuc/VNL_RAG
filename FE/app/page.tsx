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
  node_count: number;
  edge_count: number;
}

export default function Home() {
  const [graphs, setGraphs] = useState<GraphListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newGraphName, setNewGraphName] = useState('');
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
      showToast('Please enter a graph name', 'error');
      return;
    }

    try {
      setIsCreating(true);
      const newGraph = await graphAPI.create({
        name: newGraphName,
        description: 'New legal graph',
      });
      
      setNewGraphName('');
      showToast('Graph created successfully!');
      
      // Redirect to graph editor
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.href = `/graph/${newGraph.id}`;
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to create graph:', error);
      showToast('Failed to create graph', 'error');
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
          <h2 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Create New Graph</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={newGraphName}
              onChange={(e) => setNewGraphName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateGraph()}
              placeholder="Enter graph name (e.g., Labor Law System)"
              style={{
                flex: 1,
                padding: '10px 15px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
            <button
              onClick={handleCreateGraph}
              disabled={isCreating || !newGraphName.trim()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isCreating ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                opacity: isCreating ? 0.6 : 1,
              }}
            >
              {isCreating ? 'Creating...' : 'Create Graph'}
            </button>
          </div>
        </div>

        {/* Graphs List */}
        <div>
          <h2 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Your Graphs</h2>
          
          {isLoading ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#999',
            }}>
              Loading graphs...
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
              <p>No graphs yet. Create one to get started!</p>
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
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <h3 style={{
                    margin: '0 0 10px 0',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#2196F3',
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
                    <span>📌 Nodes: {graph.node_count}</span>
                    <span>🔗 Edges: {graph.edge_count}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '10px',
                  }}>
                    <Link
                      href={`/graph/${graph.id}`}
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
                      Edit
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
