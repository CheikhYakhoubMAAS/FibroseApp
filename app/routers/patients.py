from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Patient
from app.schemas import PatientCreate, PatientUpdate, PatientResponse
from app.auth import require_role

router = APIRouter(prefix="/patients", tags=["patients"])

@router.post("/", response_model=PatientResponse)
async def create_patient(
    patient_data: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("medecin"))
):
    """Créer un nouveau patient"""
    db_patient = Patient(
        **patient_data.dict(),
        medecin_id=current_user.id
    )
    
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    
    return PatientResponse.from_orm(db_patient)

@router.get("/", response_model=List[PatientResponse])
async def get_patients(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("medecin"))
):
    """Récupérer la liste des patients"""
    query = db.query(Patient)
    
    # Filtrer par médecin (sauf pour les admins)
    if current_user.role.value == "medecin":
        query = query.filter(Patient.medecin_id == current_user.id)
    
    # Recherche par nom ou prénom
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Patient.nom.ilike(search_term)) | 
            (Patient.prenom.ilike(search_term))
        )
    
    patients = query.offset(skip).limit(limit).all()
    return [PatientResponse.from_orm(patient) for patient in patients]

@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("medecin"))
):
    """Récupérer un patient spécifique"""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient non trouvé"
        )
    
    # Vérifier les permissions (médecin peut voir ses patients, admin peut voir tous)
    if (current_user.role.value == "medecin" and 
        patient.medecin_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès non autorisé"
        )
    
    return PatientResponse.from_orm(patient)

@router.put("/{patient_id}", response_model=PatientResponse)
async def update_patient(
    patient_id: int,
    patient_data: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("medecin"))
):
    """Mettre à jour un patient"""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient non trouvé"
        )
    
    # Vérifier les permissions
    if (current_user.role.value == "medecin" and 
        patient.medecin_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès non autorisé"
        )
    
    # Mettre à jour les champs fournis
    update_data = patient_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)
    
    db.commit()
    db.refresh(patient)
    
    return PatientResponse.from_orm(patient)

@router.delete("/{patient_id}")
async def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("medecin"))
):
    """Supprimer un patient"""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient non trouvé"
        )
    
    # Vérifier les permissions
    if (current_user.role.value == "medecin" and 
        patient.medecin_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès non autorisé"
        )
    
    db.delete(patient)
    db.commit()
    
    return {"message": "Patient supprimé avec succès"} 