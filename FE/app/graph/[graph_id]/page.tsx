'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Toolbar from '../../../components/toolbars/Toolbar';
import GraphCanvas from '../../../components/canvas/GraphCanvas';
import SearchPanel from '../../../components/panels/SearchPanel';
import NodeDetailPanel from '../../../components/panels/NodeDetailPanel';
import { useGraphStore } from '../../../stores/graphStore';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts';
import { graphAPI, nodeAPI } from '../../../lib/api';
import Toast from '../../../components/Toast';
import DataTable from '../../../components/DataTable';

export default function GraphPage() {
  const params = useParams();
  const graphId = params?.graph_id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    setGraph,
    selectedNodeId,
    selectedEdgeId,
    viewMode,
  } = useGraphStore();

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
          sourceHandle: e.source_handle,
          targetHandle: e.target_handle,
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
    onDelete: async (id) => {
      try {
        await nodeAPI.delete(id);
      } catch (err) {
        console.error('Failed to delete node from API:', err);
      }
    },
    onSave: () => {
      const saveBtn = Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent?.includes('Save') || b.getAttribute('aria-label')?.includes('Save')
      );
      if (saveBtn) (saveBtn as HTMLButtonElement).click();
    },
  });


  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);

  // Auto-open right panel when something is selected
  useEffect(() => {
    if (selectedNodeId || selectedEdgeId) {
      setRightPanelOpen(true);
    }
  }, [selectedNodeId, selectedEdgeId]);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth > 250 && newWidth < 800) {
          setRightPanelWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

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
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {viewMode === 'canvas' ? (
          <>
            {/* Left Sidebar Toggle Button */}
            <button
              onClick={() => setLeftPanelOpen(!leftPanelOpen)}
              style={{
                position: 'absolute',
                left: leftPanelOpen ? '280px' : '0',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 100,
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '0 4px 4px 0',
                padding: '10px 4px',
                cursor: 'pointer',
                boxShadow: '2px 0 5px rgba(0,0,0,0.05)',
                transition: 'left 0.3s ease',
              }}
            >
              {leftPanelOpen ? '◀' : '▶'}
            </button>

            {/* Left Sidebar */}
            <div
              style={{
                width: leftPanelOpen ? '280px' : '0',
                backgroundColor: '#fafafa',
                borderRight: '1px solid #ddd',
                overflowY: 'auto',
                padding: leftPanelOpen ? '10px' : '0',
                boxSizing: 'border-box',
                transition: 'width 0.3s ease, padding 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                whiteSpace: 'nowrap',
              }}
            >
              {leftPanelOpen && (
                <>
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
                    flex: 1,
                    overflowY: 'auto'
                  }}>
                    <div style={{ marginBottom: '10px' }}>
                      <strong>🎨 Node Types</strong>
                      <div style={{ marginTop: '5px', fontSize: '11px' }}>
                        <div>🟢 Boolean - Logic/Condition</div>
                        <div>🔵 Decree - Government decree</div>
                        <div>🟠 Buffer - Intermediate state</div>
                        <div>🟣 Result - Final output</div>
                        <div>🔴 Teleport - Jump/Link</div>
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
                </>
              )}
            </div>

            {/* Center Canvas Area */}
            <div style={{ flex: 1, overflow: 'hidden', backgroundColor: '#f5f5f5', position: 'relative' }}>
              <GraphCanvas />
            </div>

            {/* Right Sidebar Resizer */}
            {rightPanelOpen && (
              <div
                onMouseDown={startResizing}
                style={{
                  width: '6px',
                  backgroundColor: isResizing ? '#2196F3' : 'transparent',
                  cursor: 'col-resize',
                  zIndex: 10,
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2196F3')}
                onMouseLeave={(e) => {
                  if (!isResizing) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              />
            )}

            {/* Right Sidebar Toggle Button */}
            <button
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              style={{
                position: 'absolute',
                right: rightPanelOpen ? `${rightPanelWidth}px` : '0',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 100,
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px 0 0 4px',
                padding: '10px 4px',
                cursor: 'pointer',
                boxShadow: '-2px 0 5px rgba(0,0,0,0.05)',
                transition: 'right 0.3s ease',
              }}
            >
              {rightPanelOpen ? '▶' : '◀'}
            </button>

            {/* Right Sidebar - Detail Panel */}
            <div
              style={{
                width: rightPanelOpen ? `${rightPanelWidth}px` : '0',
                backgroundColor: '#fafafa',
                borderLeft: '1px solid #ddd',
                overflowY: 'auto',
                padding: rightPanelOpen ? '10px' : '0',
                boxSizing: 'border-box',
                transition: rightPanelOpen ? 'none' : 'width 0.3s ease, padding 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                whiteSpace: 'nowrap',
              }}
            >
              {rightPanelOpen && (
                <>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>
                    Details
                  </h3>
                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    <NodeDetailPanel />
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div style={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5', overflow: 'hidden' }}>
            <DataTable />
          </div>
        )}
      </div>
      <Toast />
    </div>
  );
}
