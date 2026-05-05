import { useState, useCallback } from 'react';
import { LegalNode } from '../types/graph.types';

export const useGraphQuery = (nodes: LegalNode[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LegalNode[]>([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);

  const search = useCallback((query: string) => {
    setSearchQuery(query);
    setSelectedResultIndex(0);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = nodes.filter(node =>
      node.data.label.toLowerCase().includes(query.toLowerCase()) ||
      (node.data.content?.toLowerCase().includes(query.toLowerCase()))
    );

    setSearchResults(results);
  }, [nodes]);

  const goToNextResult = useCallback(() => {
    if (searchResults.length === 0) return;
    setSelectedResultIndex((prev) => (prev + 1) % searchResults.length);
  }, [searchResults.length]);

  const goToPreviousResult = useCallback(() => {
    if (searchResults.length === 0) return;
    setSelectedResultIndex((prev) =>
      prev === 0 ? searchResults.length - 1 : prev - 1
    );
  }, [searchResults.length]);

  const getCurrentResult = useCallback(() => {
    return searchResults[selectedResultIndex] || null;
  }, [searchResults, selectedResultIndex]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedResultIndex(0);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    selectedResultIndex,
    search,
    goToNextResult,
    goToPreviousResult,
    getCurrentResult,
    clearSearch,
  };
};
