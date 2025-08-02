from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine
from app.models import Base
from app.routers import auth, patients, diagnostics, stats
import os

# Créer les tables
Base.metadata.create_all(bind=engine)

# Créer l'application FastAPI
app = FastAPI(
    title="API Fibrose Hépatique",
    description="API pour la détection précoce de la fibrose hépatique",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuration CORS pour permettre les requêtes depuis le frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # URLs du frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Monter les fichiers statiques pour les images uploadées
if os.path.exists("uploads"):
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Inclure les routeurs
app.include_router(auth.router, prefix="/api")
app.include_router(patients.router, prefix="/api")
app.include_router(diagnostics.router, prefix="/api")
app.include_router(stats.router, prefix="/api")

@app.get("/")
async def root():
    """Endpoint racine"""
    return {
        "message": "API Fibrose Hépatique",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Vérification de l'état de l'API"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 