#!/usr/bin/env python3
"""
Script d'initialisation de la base de données
Crée les tables et ajoute des données de test
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine
from app.models import Base, User, Patient, Diagnostic
from app.auth import get_password_hash
from app.models import UserRole, Sexe
from datetime import datetime, date
import random

def init_database():
    """Initialise la base de données avec des données de test"""
    
    # Créer les tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Vérifier si des utilisateurs existent déjà
        if db.query(User).count() > 0:
            print("La base de données contient déjà des données. Skipping...")
            return
        
        # Créer les utilisateurs de test
        users = [
            User(
                nom="Dr. Martin Dubois",
                email="martin.dubois@hopital.fr",
                password_hash=get_password_hash("password123"),
                role=UserRole.MEDECIN
            ),
            User(
                nom="Dr. Sophie Laurent",
                email="sophie.laurent@hopital.fr",
                password_hash=get_password_hash("password123"),
                role=UserRole.MEDECIN
            ),
            User(
                nom="Admin Système",
                email="admin@hopital.fr",
                password_hash=get_password_hash("admin123"),
                role=UserRole.ADMIN
            ),
            User(
                nom="Super Admin",
                email="superadmin@hopital.fr",
                password_hash=get_password_hash("super123"),
                role=UserRole.SUPER_ADMIN
            )
        ]
        
        for user in users:
            db.add(user)
        db.commit()
        
        # Récupérer les IDs des utilisateurs créés
        medecin1 = db.query(User).filter(User.email == "martin.dubois@hopital.fr").first()
        medecin2 = db.query(User).filter(User.email == "sophie.laurent@hopital.fr").first()
        
        # Créer des patients de test
        patients = [
            Patient(
                nom="Dupont",
                prenom="Jean",
                date_naissance=date(1975, 5, 15),
                sexe=Sexe.M,
                telephone="01 23 45 67 89",
                email="jean.dupont@email.fr",
                adresse="123 Rue de la Santé, 75014 Paris",
                medecin_id=medecin1.id
            ),
            Patient(
                nom="Martin",
                prenom="Marie",
                date_naissance=date(1982, 9, 22),
                sexe=Sexe.F,
                telephone="01 98 76 54 32",
                email="marie.martin@email.fr",
                adresse="456 Avenue du Bien-être, 69001 Lyon",
                medecin_id=medecin1.id
            ),
            Patient(
                nom="Bernard",
                prenom="Pierre",
                date_naissance=date(1968, 12, 10),
                sexe=Sexe.M,
                telephone="04 56 78 90 12",
                medecin_id=medecin2.id
            ),
            Patient(
                nom="Leroy",
                prenom="Anne",
                date_naissance=date(1990, 3, 8),
                sexe=Sexe.F,
                telephone="02 34 56 78 90",
                email="anne.leroy@email.fr",
                adresse="789 Boulevard de la Santé, 13001 Marseille",
                medecin_id=medecin2.id
            )
        ]
        
        for patient in patients:
            db.add(patient)
        db.commit()
        
        # Créer des diagnostics de test
        diagnostics = [
            Diagnostic(
                patient_id=patients[0].id,
                medecin_id=medecin1.id,
                modele_utilise="Vision Transformer v2.1",
                resultat=1,
                probabilite=0.87,
                image_url="https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=400",
                notes="Fibrose légère détectée"
            ),
            Diagnostic(
                patient_id=patients[1].id,
                medecin_id=medecin1.id,
                modele_utilise="Vision Transformer v2.1",
                resultat=0,
                probabilite=0.92,
                image_url="https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=400",
                notes="Pas de fibrose détectée"
            ),
            Diagnostic(
                patient_id=patients[2].id,
                medecin_id=medecin2.id,
                modele_utilise="Vision Transformer v2.0",
                resultat=3,
                probabilite=0.74,
                image_url="https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=400",
                notes="Fibrose sévère - suivi rapproché recommandé"
            ),
            Diagnostic(
                patient_id=patients[3].id,
                medecin_id=medecin2.id,
                modele_utilise="Vision Transformer v2.1",
                resultat=2,
                probabilite=0.81,
                image_url="https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=400",
                notes="Fibrose modérée détectée"
            )
        ]
        
        for diagnostic in diagnostics:
            db.add(diagnostic)
        db.commit()
        
        print("✅ Base de données initialisée avec succès!")
        print("\nUtilisateurs de test créés:")
        print("- martin.dubois@hopital.fr (mot de passe: password123)")
        print("- sophie.laurent@hopital.fr (mot de passe: password123)")
        print("- admin@hopital.fr (mot de passe: admin123)")
        print("- superadmin@hopital.fr (mot de passe: super123)")
        print(f"\n{len(patients)} patients et {len(diagnostics)} diagnostics créés.")
        
    except Exception as e:
        print(f"❌ Erreur lors de l'initialisation: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_database() 