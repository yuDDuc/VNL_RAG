# Legal Graph - Frontend + Backend

A visual tool for creating and managing relationships between legal documents with an interactive graph editor.

## Features

### Frontend (React + Next.js + React Flow)
- **Interactive Canvas**: Drag-and-drop node creation and editing
- **Node Management**: Create, edit, delete legal document nodes
- **Edge/Connection Management**: Define relationships between legal documents
- **Right-Click Context Menu**: Node type selection and creation
- **Search & Highlight**: Find and highlight nodes in the graph
- **Undo/Redo**: Complete history management for all operations
- **Export Options**: JSON, PNG, CSV export formats
- **Real-time Sync**: Synchronized state across all components
- **Keyboard Shortcuts**: Ctrl+Z (undo), Ctrl+Shift+Z (redo), Delete, Ctrl+S (save)
- **Detail Panel**: Edit node and edge properties in a side panel
- **Node Types**: Law, Decree, Circular, Article, Clause, Section
- **Relation Types**: Reference, Amend, Replace, Base On, Guide, Related

### Backend (FastAPI)
- **Graph CRUD**: Create, read, update, delete graphs
- **Node CRUD**: Manage nodes with position, type, and content
- **Edge CRUD**: Manage relationships and relation types
- **RESTful API**: Clean API endpoints for all operations
- **In-Memory Storage**: Quick development setup (upgrade to PostgreSQL for production)

## Project Structure

```
BE/
├── main.py                 # FastAPI application
├── api/
│   ├── graphs.py          # Graph endpoints
│   ├── nodes.py           # Node endpoints
│   ├── edges.py           # Edge endpoints
│   └── search.py          # Search functionality
├── models/
│   ├── graph.py           # Graph model
│   ├── node.py            # Node model
│   └── edge.py            # Edge model
└── services/              # Business logic

FE/
├── app/
│   ├── page.tsx           # Home - Graph list
│   ├── layout.tsx         # Root layout with UI
│   └── graph/[id]/page.tsx # Graph editor page
├── components/
│   ├── canvas/            # Graph canvas components
│   │   ├── GraphCanvas.tsx
│   │   ├── LegalNode.tsx
│   │   ├── LegalEdge.tsx
│   │   └── ContextMenu.tsx
│   ├── panels/            # Detail panels
│   │   ├── NodeDetailPanel.tsx
│   │   └── SearchPanel.tsx
│   └── toolbars/
│       └── Toolbar.tsx
├── stores/                # Zustand state management
│   ├── graphStore.ts      # Main graph state
│   └── historyStore.ts    # Undo/redo history
├── hooks/                 # Custom React hooks
│   ├── useKeyboardShortcuts.ts
│   └── useGraphQuery.ts
├── lib/
│   ├── api.ts            # API client
│   └── exportUtils.ts    # Export functionality
└── types/
    └── graph.types.ts    # TypeScript interfaces
```

## Installation & Usage

### Backend Setup
```bash
cd BE
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
# Server runs on http://localhost:8000
```

### Frontend Setup
```bash
cd FE
npm install
npm run dev
# App runs on http://localhost:3000
```

## API Endpoints

### Graphs
- `GET /api/graphs` - List all graphs
- `POST /api/graphs` - Create new graph
- `GET /api/graphs/{id}` - Get graph details
- `PUT /api/graphs/{id}` - Update graph
- `DELETE /api/graphs/{id}` - Delete graph

### Nodes
- `POST /api/nodes` - Create node
- `GET /api/nodes/{id}` - Get node
- `PUT /api/nodes/{id}` - Update node
- `DELETE /api/nodes/{id}` - Delete node

### Edges
- `POST /api/edges` - Create edge
- `GET /api/edges/{id}` - Get edge
- `PUT /api/edges/{id}` - Update edge
- `DELETE /api/edges/{id}` - Delete edge

## State Management

Uses **Zustand** for efficient state management:
- **graphStore**: Graph, nodes, edges, selection state
- **historyStore**: Undo/redo history with past/present/future

## Technologies Used

### Frontend
- React 18+
- Next.js 14+
- React Flow 11+
- Zustand 4+
- TypeScript

### Backend
- FastAPI
- Python 3.8+
- SQLAlchemy (for future DB integration)
- Pydantic

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Right-click | Create node |
| Ctrl+Z | Undo |
| Ctrl+Shift+Z | Redo |
| Delete | Delete selected node |
| Ctrl+S | Save graph |
| Escape | Deselect |

## Future Enhancements

- [ ] PostgreSQL database integration
- [ ] User authentication & authorization
- [ ] Multi-user collaboration with WebSockets
- [ ] Graph export to PDF with layout
- [ ] Advanced search with text indexing
- [ ] Graph statistics and analytics
- [ ] Predefined graph templates
- [ ] Import from external sources
- [ ] Version control & branching
- [ ] Neo4j support for large graphs

## Development Notes

- Frontend is Next.js with React Flow for graph visualization
- State is managed via Zustand with history tracking
- API communication uses fetch with TypeScript models
- All node positions and metadata are stored in state
- History automatically updates on every graph mutation
- Keyboard shortcuts integrated via custom React hook
