from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import User, Patient, Diagnostic
from app.schemas import DiagnosticCreate, DiagnosticResponse
from app.auth import require_role
import os
import uuid
from datetime import datetime
import shutil

router = APIRouter(prefix="/diagnostics", tags=["diagnostics"])

# Configuration pour l'upload d'images
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_upload_file(upload_file: UploadFile) -> str:
    """Sauvegarde un fichier uploadé et retourne le chemin"""
    file_extension = os.path.splitext(upload_file.filename)[1]
    file_name = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    return file_path

def predict_fibrosis(image_path: str) -> tuple[int, float]:
    """
    Simulation de prédiction de fibrose
    En production, ceci serait remplacé par votre modèle ML
    """
    # Simulation - en réalité, vous chargeriez votre modèle ici
    import random
    resultat = random.randint(0, 4)
    probabilite = random.uniform(0.6, 0.95)
    return resultat, probabilite

@router.post("/", response_model=DiagnosticResponse)
async def create_diagnostic(
    patient_id: int,
    modele_utilise: str = "Vision Transformer v2.1",
    notes: Optional[str] = None,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("medecin"))
):
    """Créer un nouveau diagnostic avec upload d'image"""
    # Vérifier que le patient existe et appartient au médecin
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient non trouvé"
        )
    
    if patient.medecin_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès non autorisé à ce patient"
        )
    
    # Sauvegarder l'image
    image_path = save_upload_file(image)
    
    # Prédire la fibrose (simulation)
    resultat, probabilite = predict_fibrosis(image_path)
    
    # Créer le diagnostic
    db_diagnostic = Diagnostic(
        patient_id=patient_id,
        medecin_id=current_user.id,
        modele_utilise=modele_utilise,
        resultat=resultat,
        probabilite=probabilite,
        image_url=image_path,
        notes=notes
    )
    
    db.add(db_diagnostic)
    db.commit()
    db.refresh(db_diagnostic)
    
    return DiagnosticResponse.from_orm(db_diagnostic)

@router.get("/", response_model=List[DiagnosticResponse])
async def get_diagnostics(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    patient_id: Optional[int] = Query(None),
    resultat: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("medecin"))
):
    """Récupérer la liste des diagnostics"""
    query = db.query(Diagnostic)
    
    # Filtrer par médecin (sauf pour les admins)
    if current_user.role.value == "medecin":
        query = query.filter(Diagnostic.medecin_id == current_user.id)
    
    # Filtres optionnels
    if patient_id:
        query = query.filter(Diagnostic.patient_id == patient_id)
    
    if resultat is not None:
        query = query.filter(Diagnostic.resultat == resultat)
    
    diagnostics = query.offset(skip).limit(limit).order_by(Diagnostic.date.desc()).all()
    return [DiagnosticResponse.from_orm(diagnostic) for diagnostic in diagnostics]

@router.get("/{diagnostic_id}", response_model=DiagnosticResponse)
async def get_diagnostic(
    diagnostic_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("medecin"))
):
    """Récupérer un diagnostic spécifique"""
    diagnostic = db.query(Diagnostic).filter(Diagnostic.id == diagnostic_id).first()
    
    if not diagnostic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagnostic non trouvé"
        )
    
    # Vérifier les permissions
    if (current_user.role.value == "medecin" and 
        diagnostic.medecin_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès non autorisé"
        )
    
    return DiagnosticResponse.from_orm(diagnostic)

@router.delete("/{diagnostic_id}")
async def delete_diagnostic(
    diagnostic_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("medecin"))
):
    """Supprimer un diagnostic"""
    diagnostic = db.query(Diagnostic).filter(Diagnostic.id == diagnostic_id).first()
    
    if not diagnostic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagnostic non trouvé"
        )
    
    # Vérifier les permissions
    if (current_user.role.value == "medecin" and 
        diagnostic.medecin_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès non autorisé"
        )
    
    # Supprimer l'image associée
    if diagnostic.image_url and os.path.exists(diagnostic.image_url):
        os.remove(diagnostic.image_url)
    
    db.delete(diagnostic)
    db.commit()
    
    return {"message": "Diagnostic supprimé avec succès"} 