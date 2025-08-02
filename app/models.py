from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class UserRole(str, enum.Enum):
    MEDECIN = "medecin"
    ADMIN = "admin"
    SUPER_ADMIN = "super-admin"

class Sexe(str, enum.Enum):
    M = "M"
    F = "F"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.MEDECIN)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relations
    patients = relationship("Patient", back_populates="medecin")
    diagnostics = relationship("Diagnostic", back_populates="medecin")

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String(100), nullable=False)
    prenom = Column(String(100), nullable=False)
    date_naissance = Column(DateTime, nullable=False)
    sexe = Column(Enum(Sexe), nullable=False)
    telephone = Column(String(20))
    email = Column(String(255))
    adresse = Column(Text)
    medecin_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relations
    medecin = relationship("User", back_populates="patients")
    diagnostics = relationship("Diagnostic", back_populates="patient")

class Diagnostic(Base):
    __tablename__ = "diagnostics"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    medecin_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime(timezone=True), server_default=func.now())
    modele_utilise = Column(String(100), nullable=False)
    resultat = Column(Integer, nullable=False)  # 0-4 stade de fibrose
    probabilite = Column(Float, nullable=False)
    image_url = Column(String(500))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relations
    patient = relationship("Patient", back_populates="diagnostics")
    medecin = relationship("User", back_populates="diagnostics")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String(100), nullable=False)
    table_name = Column(String(50))
    record_id = Column(Integer)
    details = Column(Text)
    ip_address = Column(String(45))
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 