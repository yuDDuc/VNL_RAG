"""
Quick start guide for the Legal Graph application
"""

# QUICK START GUIDE

## Backend Setup

```bash
cd BE

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Frontend Setup

```bash
cd FE

# Install dependencies
npm install

# Run the development server
npm run dev
```

The app will be available at:
- App: http://localhost:3000

## Using the Application

1. **Create a New Graph**
   - Go to http://localhost:3000
   - Enter a name for your graph
   - Click "Create Graph"

2. **Add Nodes**
   - Right-click on the canvas
   - Select a node type (Law, Decree, Circular, etc.)
   - Enter the node name
   - Node appears on the canvas

3. **Connect Nodes**
   - Click and drag from one node to another
   - A connection is created
   - Click on the edge to edit its relation type

4. **Edit Node Details**
   - Click a node to select it
   - Edit properties in the right panel
   - Change label, type, and content
   - Click "Save Node"

5. **Search Nodes**
   - Use the search panel on the left
   - Filter nodes by name or content
   - Navigate through results

6. **Save Graph**
   - Click "Save" in the toolbar
   - Graph is saved to the backend

7. **Export Data**
   - Choose export format: JSON, PNG, or CSV
   - File is downloaded locally

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Right-click | Create node menu |
| Ctrl+Z | Undo |
| Ctrl+Shift+Z | Redo |
| Delete | Delete selected node |
| Ctrl+S | Save graph |

## Project Structure

```
legal-graph/
├── BE/                      # Backend (FastAPI)
│   ├── main.py             # Entry point
│   ├── api/                # API route handlers
│   ├── models/             # Data models
│   ├── services/           # Business logic
│   └── core/               # Configuration & utilities
│
└── FE/                      # Frontend (React + Next.js)
    ├── app/                # Next.js app pages
    ├── components/         # React components
    ├── stores/             # State management (Zustand)
    ├── hooks/              # Custom React hooks
    ├── lib/                # Utilities & API client
    └── types/              # TypeScript definitions
```

## API Documentation

### Graphs
- `GET /api/graphs` - List all graphs
- `POST /api/graphs` - Create graph
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

## Node Types

- **Law**: National law/act
- **Decree**: Government decree  
- **Circular**: Ministry circular
- **Article**: Main article/section
- **Clause**: Detailed clause/subsection
- **Section**: Further subdivision

## Relation Types

- **reference**: Cites or references another document
- **amend**: Is amended or modified by
- **replace**: Replaces or substitutes
- **base_on**: Based on or founded on
- **guide**: Provides guidance for
- **related**: Is related to

## Troubleshooting

### Backend won't start
- Check if port 8000 is available
- Ensure Python 3.8+ is installed
- Check virtual environment is activated

### Frontend won't connect to backend
- Ensure backend is running on http://localhost:8000
- Check CORS settings in BE/main.py
- Check .env.local has correct API_URL

### No nodes appearing
- Make sure you right-clicked to create
- Check browser console for errors
- Ensure graph was created successfully

## Development Notes

- Frontend uses React Flow for graph visualization
- State managed via Zustand
- History/undo-redo fully implemented
- API uses in-memory storage (upgrade to PostgreSQL for production)
- CORS enabled for localhost development
