import { LegalNode, LegalEdge, LegalGraph } from '../types/graph.types';

// Export to JSON
export const exportToJSON = (graph: LegalGraph): string => {
  return JSON.stringify(graph, null, 2);
};

export const downloadJSON = (graph: LegalGraph) => {
  const json = exportToJSON(graph);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${graph.name || 'graph'}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Export to PNG (using canvas)
export const exportToPNG = async (
  svgElement: SVGSVGElement | null,
  graphName: string = 'graph'
) => {
  if (!svgElement) {
    console.error('SVG element not found');
    return;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const img = new Image();

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${graphName}.png`;
    link.click();
  };

  // Use a workaround for Unicode characters with btoa
  const unicodeBase64 = btoa(unescape(encodeURIComponent(svgData)));
  img.src = 'data:image/svg+xml;base64,' + unicodeBase64;
};

// Import from JSON
export const importFromJSON = (jsonString: string): LegalGraph => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};

// Generate CSV of nodes
export const exportNodesToCSV = (nodes: LegalNode[]): string => {
  const headers = ['ID', 'Label', 'Type', 'Content'];
  const rows = nodes.map(node => [
    node.id,
    node.data.label,
    node.type,
    node.data.content || '',
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');
};

// Generate CSV of edges
export const exportEdgesToCSV = (edges: LegalEdge[]): string => {
  const headers = ['Source', 'Target', 'Relation Type', 'Label'];
  const rows = edges.map(edge => [
    edge.source,
    edge.target,
    edge.label || 'related',
    edge.label || '',
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');
};
