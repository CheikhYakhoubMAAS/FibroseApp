# Application de Détection Précoce de Fibrose Hépatique

Application web complète pour la détection précoce de la fibrose hépatique à partir d'images échographiques, développée avec FastAPI (backend) et React/TypeScript (frontend).

## 🏗️ Architecture

- **Backend**: FastAPI + SQLAlchemy + MySQL
- **Frontend**: React + TypeScript + Tailwind CSS
- **Authentification**: JWT (JSON Web Tokens)
- **Base de données**: MySQL
- **Upload d'images**: Gestion des fichiers avec FastAPI

## 🚀 Installation et Configuration

### Prérequis

- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- npm ou yarn

### 1. Configuration de la base de données MySQL

```sql
CREATE DATABASE fibrose_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'fibrose_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON fibrose_app.* TO 'fibrose_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Configuration de l'environnement

Copiez le fichier d'exemple et configurez vos variables :

```bash
cp env.example .env
```

Modifiez le fichier `.env` avec vos paramètres :

```env
DATABASE_URL=mysql+mysqlconnector://fibrose_user:votre_mot_de_passe@localhost:3306/fibrose_app
SECRET_KEY=votre-cle-secrete-tres-longue-et-complexe
```

### 3. Installation des dépendances Python

```bash
pip install -r requirements.txt
```

### 4. Initialisation de la base de données

```bash
python scripts/init_db.py
```

### 5. Installation des dépendances Node.js

```bash
npm install
```

## 🏃‍♂️ Démarrage de l'application

### 1. Démarrer le serveur FastAPI (Backend)

```bash
# Option 1: Avec uvicorn directement
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Option 2: Avec le script Python
python app/main.py
```

Le serveur sera accessible sur : http://localhost:8000
- Documentation API : http://localhost:8000/docs
- Documentation ReDoc : http://localhost:8000/redoc

### 2. Démarrer le serveur de développement React (Frontend)

```bash
npm run dev
```

L'application sera accessible sur : http://localhost:5173

## 👥 Utilisateurs de test

Après l'initialisation de la base de données, vous pouvez vous connecter avec :

### Médecins
- **Email**: martin.dubois@hopital.fr
- **Mot de passe**: password123

- **Email**: sophie.laurent@hopital.fr  
- **Mot de passe**: password123

### Administrateurs
- **Email**: admin@hopital.fr
- **Mot de passe**: admin123

- **Email**: superadmin@hopital.fr
- **Mot de passe**: super123

## 📋 Fonctionnalités

### 🔐 Authentification et Gestion des Utilisateurs
- Connexion sécurisée avec JWT
- Trois rôles : médecin, admin, super-admin
- Gestion des sessions
- Permissions granulaires (RBAC)

### 👥 Gestion des Patients
- Création, modification, suppression de patients
- Association automatique au médecin connecté
- Recherche et filtrage des patients
- Validation des données

### 🔬 Diagnostics et IA
- Upload d'images échographiques
- Prédiction automatique de fibrose (simulation)
- Historique des diagnostics
- Notes et commentaires
- Gestion des modèles ML

### 📊 Statistiques et Métriques
- Tableau de bord avec métriques clés
- Graphiques interactifs (Chart.js)
- Filtrage par date, médecin, stade
- Performance des modèles
- Statistiques par médecin

### 🛡️ Sécurité et Administration
- Journalisation des actions (audit logs)
- Gestion des permissions
- Validation côté client et serveur
- Protection CSRF
- Headers de sécurité

## 🏗️ Structure du Projet

```
project/
├── app/                    # Backend FastAPI
│   ├── main.py            # Point d'entrée FastAPI
│   ├── database.py        # Configuration SQLAlchemy
│   ├── models.py          # Modèles SQLAlchemy
│   ├── schemas.py         # Schémas Pydantic
│   ├── auth.py            # Authentification JWT
│   └── routers/           # Routeurs API
│       ├── auth.py        # Authentification
│       ├── patients.py    # Gestion patients
│       ├── diagnostics.py # Diagnostics
│       └── stats.py       # Statistiques
├── src/                   # Frontend React
│   ├── components/        # Composants React
│   ├── contexts/          # Contextes React
│   ├── services/          # Services API
│   ├── types/             # Types TypeScript
│   └── data/              # Données mockées
├── scripts/               # Scripts utilitaires
│   └── init_db.py         # Initialisation DB
├── uploads/               # Images uploadées
├── requirements.txt       # Dépendances Python
├── package.json          # Dépendances Node.js
└── README.md             # Documentation
```

## 🔧 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Informations utilisateur
- `POST /api/auth/register` - Création utilisateur (admin)

### Patients
- `GET /api/patients/` - Liste des patients
- `POST /api/patients/` - Créer un patient
- `GET /api/patients/{id}` - Détails d'un patient
- `PUT /api/patients/{id}` - Modifier un patient
- `DELETE /api/patients/{id}` - Supprimer un patient

### Diagnostics
- `GET /api/diagnostics/` - Liste des diagnostics
- `POST /api/diagnostics/` - Créer un diagnostic
- `GET /api/diagnostics/{id}` - Détails d'un diagnostic
- `DELETE /api/diagnostics/{id}` - Supprimer un diagnostic

### Statistiques
- `GET /api/stats/` - Statistiques globales
- `GET /api/stats/medecins` - Statistiques par médecin
- `GET /api/stats/performance` - Performance des modèles

## 🧪 Tests

### Tests Backend
```bash
pytest tests/
```

### Tests Frontend
```bash
npm test
```

## 🐳 Docker (Optionnel)

### Docker Compose
```bash
docker-compose up -d
```

### Dockerfile
```bash
docker build -t fibrose-app .
docker run -p 8000:8000 fibrose-app
```

## 🔒 Sécurité

- Authentification JWT avec expiration
- Mots de passe hashés avec bcrypt
- Validation des données avec Pydantic
- Protection CORS configurée
- Permissions granulaires par rôle
- Audit logs pour toutes les actions

## 📈 Déploiement

### Variables d'environnement de production
```env
DATABASE_URL=mysql+mysqlconnector://user:pass@host:port/db
SECRET_KEY=cle-secrete-tres-longue-et-complexe
ENVIRONMENT=production
```

### Build de production
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm run build
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation API : http://localhost:8000/docs
- Vérifiez les logs du serveur

## 🔮 Roadmap

- [ ] Intégration de vrais modèles ML
- [ ] Notifications en temps réel
- [ ] Export de rapports PDF
- [ ] Interface mobile responsive
- [ ] Tests automatisés complets
- [ ] Monitoring et alertes
- [ ] Intégration continue (CI/CD) 