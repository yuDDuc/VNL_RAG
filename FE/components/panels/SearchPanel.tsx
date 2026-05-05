import React, { useState } from 'react';
import { useGraphStore } from '../../stores/graphStore';
import { useGraphQuery } from '../../hooks/useGraphQuery';

const SearchPanel: React.FC = () => {
  const { nodes, selectNode } = useGraphStore();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    selectedResultIndex,
    search,
    goToNextResult,
    goToPreviousResult,
    getCurrentResult,
    clearSearch,
  } = useGraphQuery(nodes);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    search(query);
  };

  const handleSelectResult = (nodeId: string) => {
    selectNode(nodeId);
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '10px',
      marginBottom: '10px',
    }}>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            style={{
              marginTop: '5px',
              padding: '4px 8px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Clear
          </button>
        )}
      </div>

      {searchResults.length > 0 && (
        <div>
          <div style={{
            marginBottom: '10px',
            fontSize: '12px',
            color: '#666',
          }}>
            Found {searchResults.length} results
            {searchResults.length > 0 && ` (${selectedResultIndex + 1}/${searchResults.length})`}
          </div>

          <div style={{
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #eee',
            borderRadius: '4px',
            marginBottom: '10px',
          }}>
            {searchResults.map((node, index) => (
              <div
                key={node.id}
                onClick={() => handleSelectResult(node.id)}
                style={{
                  padding: '8px',
                  backgroundColor: index === selectedResultIndex ? '#e3f2fd' : 'white',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: index === selectedResultIndex ? 'bold' : 'normal',
                }}
              >
                {node.data.label}
                {node.type && (
                  <span style={{ fontSize: '11px', color: '#999', marginLeft: '5px' }}>
                    ({node.type})
                  </span>
                )}
              </div>
            ))}
          </div>

          {searchResults.length > 1 && (
            <div style={{ display: 'flex', gap: '5px' }}>
              <button
                onClick={goToPreviousResult}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  flex: 1,
                }}
              >
                ← Prev
              </button>
              <button
                onClick={goToNextResult}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  flex: 1,
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPanel;
