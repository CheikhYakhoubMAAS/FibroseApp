from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from app.database import get_db
from app.models import User, Patient, Diagnostic
from app.schemas import StatisticsResponse
from app.auth import require_role
from datetime import datetime, timedelta

router = APIRouter(prefix="/stats", tags=["statistiques"])

@router.get("/", response_model=StatisticsResponse)
async def get_statistics(
    start_date: str = Query(None, description="Date de début (YYYY-MM-DD)"),
    end_date: str = Query(None, description="Date de fin (YYYY-MM-DD)"),
    medecin_id: int = Query(None, description="ID du médecin pour filtrer"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("medecin"))
):
    """Récupérer les statistiques globales"""
    
    # Construire les filtres de base
    patient_query = db.query(Patient)
    diagnostic_query = db.query(Diagnostic)
    
    # Filtrer par médecin si spécifié ou si l'utilisateur est un médecin
    if medecin_id:
        patient_query = patient_query.filter(Patient.medecin_id == medecin_id)
        diagnostic_query = diagnostic_query.filter(Diagnostic.medecin_id == medecin_id)
    elif current_user.role.value == "medecin":
        patient_query = patient_query.filter(Patient.medecin_id == current_user.id)
        diagnostic_query = diagnostic_query.filter(Diagnostic.medecin_id == current_user.id)
    
    # Filtrer par dates si spécifiées
    if start_date:
        start_dt = datetime.strptime(start_date, "%Y-%m-%d")
        patient_query = patient_query.filter(Patient.created_at >= start_dt)
        diagnostic_query = diagnostic_query.filter(Diagnostic.created_at >= start_dt)
    
    if end_date:
        end_dt = datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1)
        patient_query = patient_query.filter(Patient.created_at < end_dt)
        diagnostic_query = diagnostic_query.filter(Diagnostic.created_at < end_dt)
    
    # Compter les patients et diagnostics
    total_patients = patient_query.count()
    total_diagnostics = diagnostic_query.count()
    
    # Répartition par stade de fibrose
    repartition_query = diagnostic_query.with_entities(
        Diagnostic.resultat,
        func.count(Diagnostic.id).label('count')
    ).group_by(Diagnostic.resultat)
    
    repartition_fibrose = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0}
    for resultat, count in repartition_query.all():
        repartition_fibrose[resultat] = count
    
    # Diagnostics par mois (6 derniers mois)
    six_months_ago = datetime.now() - timedelta(days=180)
    diagnostics_par_mois_query = diagnostic_query.filter(
        Diagnostic.created_at >= six_months_ago
    ).with_entities(
        extract('month', Diagnostic.created_at).label('month'),
        func.count(Diagnostic.id).label('count')
    ).group_by(
        extract('month', Diagnostic.created_at)
    ).order_by('month')
    
    diagnostics_par_mois = []
    for month, count in diagnostics_par_mois_query.all():
        month_name = datetime(2024, month, 1).strftime('%b')
        diagnostics_par_mois.append({
            "mois": month_name,
            "count": count
        })
    
    return StatisticsResponse(
        total_patients=total_patients,
        total_diagnostics=total_diagnostics,
        repartition_fibrose=repartition_fibrose,
        diagnostics_par_mois=diagnostics_par_mois
    )

@router.get("/medecins")
async def get_medecin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    """Statistiques par médecin (admin seulement)"""
    medecins_stats = db.query(
        User.id,
        User.nom,
        func.count(Patient.id).label('patients_count'),
        func.count(Diagnostic.id).label('diagnostics_count')
    ).outerjoin(Patient, User.id == Patient.medecin_id)\
     .outerjoin(Diagnostic, User.id == Diagnostic.medecin_id)\
     .filter(User.role == "medecin")\
     .group_by(User.id, User.nom)\
     .all()
    
    return [
        {
            "medecin_id": medecin_id,
            "nom": nom,
            "patients_count": patients_count,
            "diagnostics_count": diagnostics_count
        }
        for medecin_id, nom, patients_count, diagnostics_count in medecins_stats
    ]

@router.get("/performance")
async def get_model_performance(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("medecin"))
):
    """Performance des modèles de diagnostic"""
    performance_query = db.query(
        Diagnostic.modele_utilise,
        func.count(Diagnostic.id).label('total_diagnostics'),
        func.avg(Diagnostic.probabilite).label('avg_probabilite'),
        func.count(Diagnostic.id).filter(Diagnostic.probabilite >= 0.8).label('high_confidence')
    ).group_by(Diagnostic.modele_utilise)
    
    # Filtrer par médecin si nécessaire
    if current_user.role.value == "medecin":
        performance_query = performance_query.filter(Diagnostic.medecin_id == current_user.id)
    
    performance_data = performance_query.all()
    
    return [
        {
            "modele": modele,
            "total_diagnostics": total,
            "moyenne_probabilite": float(avg_prob),
            "diagnostics_haute_confiance": high_conf
        }
        for modele, total, avg_prob, high_conf in performance_data
    ] 