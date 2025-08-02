#!/usr/bin/env python3
"""
Script de démarrage pour l'application Fibrose Hépatique
Lance le serveur FastAPI avec les bonnes configurations
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def check_dependencies():
    """Vérifie que toutes les dépendances sont installées"""
    print("🔍 Vérification des dépendances...")
    
    # Vérifier Python
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ requis")
        return False
    
    # Vérifier les packages Python
    try:
        import fastapi
        import uvicorn
        import sqlalchemy
        print("✅ Dépendances Python OK")
    except ImportError as e:
        print(f"❌ Dépendances Python manquantes: {e}")
        print("Installez avec: pip install -r requirements.txt")
        return False
    
    return True

def check_database():
    """Vérifie la connexion à la base de données"""
    print("🔍 Vérification de la base de données...")
    
    try:
        from app.database import engine
        from sqlalchemy import text
        
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✅ Connexion à la base de données OK")
        return True
    except Exception as e:
        print(f"❌ Erreur de connexion à la base de données: {e}")
        print("Vérifiez votre configuration dans .env")
        return False

def init_database():
    """Initialise la base de données si nécessaire"""
    print("🔧 Initialisation de la base de données...")
    
    try:
        from scripts.init_db import init_database
        init_database()
        return True
    except Exception as e:
        print(f"❌ Erreur lors de l'initialisation: {e}")
        return False

def start_server():
    """Démarre le serveur FastAPI"""
    print("🚀 Démarrage du serveur FastAPI...")
    
    # Configuration par défaut
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    
    print(f"📍 Serveur accessible sur: http://{host}:{port}")
    print(f"📚 Documentation API: http://{host}:{port}/docs")
    print(f"📖 Documentation ReDoc: http://{host}:{port}/redoc")
    print("\n🔄 Redémarrage automatique activé")
    print("⏹️  Appuyez sur Ctrl+C pour arrêter")
    print("-" * 50)
    
    # Démarrer le serveur
    try:
        import uvicorn
        uvicorn.run(
            "app.main:app",
            host=host,
            port=port,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n🛑 Serveur arrêté")
    except Exception as e:
        print(f"❌ Erreur lors du démarrage: {e}")

def main():
    """Fonction principale"""
    print("🏥 Application de Détection Précoce de Fibrose Hépatique")
    print("=" * 60)
    
    # Vérifications préalables
    if not check_dependencies():
        sys.exit(1)
    
    if not check_database():
        print("\n💡 Solutions possibles:")
        print("1. Vérifiez que MySQL est démarré")
        print("2. Créez la base de données: CREATE DATABASE fibrose_app;")
        print("3. Vérifiez votre configuration dans .env")
        sys.exit(1)
    
    # Initialiser la base de données
    if not init_database():
        print("⚠️  L'initialisation a échoué, mais on continue...")
    
    # Démarrer le serveur
    start_server()

if __name__ == "__main__":
    main() 