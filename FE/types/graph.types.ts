export interface LegalNode {
  id: string;
  type: string; // 'law', 'decree', 'article', etc.
  position: { x: number; y: number };
  data: {
    label: string;
    content?: string;
    size?: number; // Kích thước hình tròn (mặc định 80)
  };
}

export interface LegalEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  label?: string; // 'reference', 'amend', 'replace', etc.
  type?: string;
  color?: string;
  content?: string;
}

export interface LegalGraph {
  id: string;
  name: string;
  nodes: LegalNode[];
  edges: LegalEdge[];
}
