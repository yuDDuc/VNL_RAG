from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import graphs, nodes, edges, upload

app = FastAPI(
    title="Legal Graph API",
    version="1.0.0",
    description="API for managing legal document graphs with nodes and edges"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(graphs.router, prefix="/api/graphs", tags=["Graphs"])
app.include_router(nodes.router, prefix="/api/nodes", tags=["Nodes"])
app.include_router(edges.router, prefix="/api/edges", tags=["Edges"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Legal Graph API",
        "version": "1.0.0",
        "endpoints": {
            "graphs": "/api/graphs",
            "nodes": "/api/nodes",
            "edges": "/api/edges",
            "docs": "/docs",
            "redoc": "/redoc"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
