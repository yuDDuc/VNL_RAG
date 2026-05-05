'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Toolbar from '../../../components/toolbars/Toolbar';
import GraphCanvas from '../../../components/canvas/GraphCanvas';
import SearchPanel from '../../../components/panels/SearchPanel';
import NodeDetailPanel from '../../../components/panels/NodeDetailPanel';
import { useGraphStore } from '../../../stores/graphStore';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts';
import { graphAPI } from '../../../lib/api';

export default function GraphPage() {
  const params = useParams();
  const graphId = params?.graph_id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { 
    setGraph, 
    graphName, 
    selectedNodeId,
    nodes,
    edges,
  } = useGraphStore();
  const [isSaving, setIsSaving] = useState(false);

  // Load graph data
  useEffect(() => {
    if (!graphId) return;

    const loadGraph = async () => {
      try {
        setIsLoading(true);
        const data = await graphAPI.getOne(graphId);
        
        // Convert API format to store format
        const nodes = data.nodes.map((n: any) => ({
          id: n.id,
          type: n.type,
          position: { x: n.x, y: n.y },
          data: {
            label: n.label,
            content: n.content,
          },
        }));

        const edges = data.edges.map((e: any) => ({
          id: e.id,
          source: e.source_node_id,
          target: e.target_node_id,
          label: e.relation_type,
        }));

        setGraph(graphId, data.name, nodes, edges);
        setError(null);
      } catch (err) {
        console.error('Failed to load graph:', err);
        setError('Failed to load graph. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadGraph();
  }, [graphId, setGraph]);

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    selectedNodeId,
    onSave: () => {
      const saveBtn = document.querySelector('button:has(:contains("Save"))') as HTMLButtonElement;
      if (saveBtn) saveBtn.click();
    },
  });

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        fontSize: '16px',
        color: '#999',
      }}>
        Loading graph...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}>
          <h3 style={{ color: '#f44336' }}>{error}</h3>
          <a href="/" style={{
            display: 'inline-block',
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
          }}>
            ← Back to Graphs
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      {/* Header Toolbar */}
      <Toolbar />

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <div
          style={{
            width: '280px',
            backgroundColor: '#fafafa',
            borderRight: '1px solid #ddd',
            overflowY: 'auto',
            padding: '10px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>
              Search
            </h3>
            <SearchPanel />
          </div>

          <div style={{
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '12px',
            color: '#666',
          }}>
            <div style={{ marginBottom: '10px' }}>
              <strong>🎨 Node Types</strong>
              <div style={{ marginTop: '5px', fontSize: '11px' }}>
                <div>🟢 Law - National law</div>
                <div>🔵 Decree - Government decree</div>
                <div>🟠 Circular - Ministry circular</div>
                <div>🟣 Article - Main article</div>
                <div>🔴 Clause - Detailed clause</div>
                <div>🔷 Section - Subsection</div>
              </div>
            </div>

            <div style={{ marginBottom: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
              <strong>🔗 Relation Types</strong>
              <div style={{ marginTop: '5px', fontSize: '11px' }}>
                <div>reference - Cites/References</div>
                <div>amend - Is amended by (---)</div>
                <div>replace - Replaces/Substitutes</div>
                <div>base_on - Based on</div>
                <div>guide - Provides guidance for</div>
                <div>related - Related to</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
              <strong>⌨️ Keyboard Shortcuts</strong>
              <div style={{ marginTop: '5px', fontSize: '11px' }}>
                <div>Right-click → Create node</div>
                <div>Ctrl+Z → Undo</div>
                <div>Ctrl+Shift+Z → Redo</div>
                <div>Delete → Remove selected</div>
                <div>Ctrl+S → Save</div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Canvas Area */}
        <div style={{ flex: 1, overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
          <GraphCanvas />
        </div>

        {/* Right Sidebar - Detail Panel */}
        <div
          style={{
            width: '300px',
            backgroundColor: '#fafafa',
            borderLeft: '1px solid #ddd',
            overflowY: 'auto',
            padding: '10px',
            boxSizing: 'border-box',
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>
            Details
          </h3>
          <NodeDetailPanel />
        </div>
      </div>
    </div>
  );
}
