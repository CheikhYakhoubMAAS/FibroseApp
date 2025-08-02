from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime
from app.models import UserRole, Sexe

# Schémas pour l'authentification
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    nom: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.MEDECIN

class UserResponse(BaseModel):
    id: int
    nom: str
    email: str
    role: UserRole
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Schémas pour les patients
class PatientCreate(BaseModel):
    nom: str
    prenom: str
    date_naissance: datetime
    sexe: Sexe
    telephone: Optional[str] = None
    email: Optional[EmailStr] = None
    adresse: Optional[str] = None

class PatientUpdate(BaseModel):
    nom: Optional[str] = None
    prenom: Optional[str] = None
    date_naissance: Optional[datetime] = None
    sexe: Optional[Sexe] = None
    telephone: Optional[str] = None
    email: Optional[EmailStr] = None
    adresse: Optional[str] = None

class PatientResponse(BaseModel):
    id: int
    nom: str
    prenom: str
    date_naissance: datetime
    sexe: Sexe
    telephone: Optional[str]
    email: Optional[str]
    adresse: Optional[str]
    medecin_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Schémas pour les diagnostics
class DiagnosticCreate(BaseModel):
    patient_id: int
    modele_utilise: str
    resultat: int
    probabilite: float
    image_url: Optional[str] = None
    notes: Optional[str] = None
    
    @validator('resultat')
    def validate_resultat(cls, v):
        if v < 0 or v > 4:
            raise ValueError('Le résultat doit être entre 0 et 4')
        return v
    
    @validator('probabilite')
    def validate_probabilite(cls, v):
        if v < 0 or v > 1:
            raise ValueError('La probabilité doit être entre 0 et 1')
        return v

class DiagnosticResponse(BaseModel):
    id: int
    patient_id: int
    medecin_id: int
    date: datetime
    modele_utilise: str
    resultat: int
    probabilite: float
    image_url: Optional[str]
    notes: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Schémas pour les statistiques
class StatisticsResponse(BaseModel):
    total_patients: int
    total_diagnostics: int
    repartition_fibrose: dict[int, int]
    diagnostics_par_mois: List[dict[str, any]]

# Schémas pour l'audit
class AuditLogResponse(BaseModel):
    id: int
    user_id: Optional[int]
    action: str
    table_name: Optional[str]
    record_id: Optional[int]
    details: Optional[str]
    ip_address: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True 