# 🌱 EcoLearn AI - Architecture Technique

## 📋 Vision et Objectifs

### 🎯 But Principal
**EcoLearn AI (GreenAISystems)** est une plateforme d'apprentissage écologique qui combine :
- **Intelligence Artificielle** pour générer des parcours d'apprentissage personnalisés
- **Conscience environnementale** en calculant et compensant l'empreinte carbone de chaque session
- **DevOps moderne** pour un déploiement fiable et scalable

### 🌟 Objectifs Clés
1. 📚 **Apprentissage Personnalisé** : Générer des parcours sur mesure adaptés au niveau de chaque utilisateur
2. 🌍 **Impact Environnemental** : Calculer, suivre et compenser l'empreinte carbone des sessions IA
3. 📊 **Transparence** : Visualiser l'impact écologique en temps réel
4. 🌳 **Action Positive** : Planter des arbres pour compenser les émissions CO2

---

## 🏗️ Architecture Globale

```
┌─────────────────────────────────────────────────────────────────────┐
│                         👤 UTILISATEURS                              │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    🎨 FRONTEND LAYER (React)                         │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐           │
│  │   Login/    │  │  Dashboard   │  │  Carbon Impact    │           │
│  │  Register   │  │  Generator   │  │    Viewer         │           │
│  └─────────────┘  └──────────────┘  └───────────────────┘           │
│                                                                       │
│  Technologies: React, Vite, D3.js                                   │
│  Port: localhost:5173                                                │
└────────────────────────────┬────────────────────────────────────────┘
                             │ HTTP/REST
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 🚀 API GATEWAY (FastAPI)                             │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐           │
│  │ Auth Router  │  │  IA Router   │  │   User Router    │           │
│  │  🔐 JWT      │  │  🤖 Gemini   │  │  👤 CRUD Users   │           │
│  └──────────────┘  └──────────────┘  └──────────────────┘           │
│                                                                       │
│  Endpoints:                                                          │
│  • POST /api/auth/login                                             │
│  • POST /api/auth/register                                          │
│  • POST /api/ia/generate                                            │
│  • GET  /api/users/me                                               │
│                                                                       │
│  Technologies: FastAPI, Uvicorn, Pydantic                           │
│  Port: localhost:8000                                                │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ⚙️ SERVICES LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │   IA Service     │  │  Carbon Service  │  │   User Service   │  │
│  │                  │  │                  │  │                  │  │
│  │ • Generate       │  │ • Calculate CO2  │  │ • Authentication │  │
│  │   Parcours       │  │ • Track Energy   │  │ • CRUD          │  │
│  │ • Gemini API     │  │ • Tree Equiv.    │  │ • Sessions      │  │
│  └────────┬─────────┘  └──────────────────┘  └──────────────────┘  │
│           │                                                          │
│           │  ┌────────────────────────────────────────┐             │
│           └─▶│  🤖 Google Gemini 2.5 Flash API        │             │
│              │  (External Service)                    │             │
│              └────────────────────────────────────────┘             │
└────────────────────────────┬────────────────────────────────────────┘
                             │ SQLAlchemy ORM
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  💾 DATABASE LAYER (PostgreSQL)                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      📊 Tables                                │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                               │  │
│  │  1. utilisateur                                              │  │
│  │     • id, nom, email, mot_de_passe, role_id                 │  │
│  │     • created_at, updated_at                                 │  │
│  │                                                               │  │
│  │  2. parcours_apprentissage                                   │  │
│  │     • id, titre, contenu_genere_ia                          │  │
│  │     • utilisateur_id, date_creation                         │  │
│  │                                                               │  │
│  │  3. session_apprentissage                                    │  │
│  │     • id, date_debut, date_fin                              │  │
│  │     • parcours_id, utilisateur_id                           │  │
│  │                                                               │  │
│  │  4. empreinte_carbone                                        │  │
│  │     • id, co2_grammes, energie_kwh                          │  │
│  │     • equivalent_arbres, session_id                         │  │
│  │                                                               │  │
│  │  5. plantation_arbres                                        │  │
│  │     • id, nombre_arbres, date_plantation                    │  │
│  │     • empreinte_id, statut                                  │  │
│  │                                                               │  │
│  │  6. reponse_ia                                               │  │
│  │     • id, prompt, reponse, tokens_utilises                  │  │
│  │     • session_id, modele_utilise                            │  │
│  │                                                               │  │
│  │  7. role                                                      │  │
│  │     • id, nom (user, admin)                                 │  │
│  │                                                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  Connection: postgresql://greenadmin:***@postgres:5432/greenaisystem_db │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                  🐳 INFRASTRUCTURE (Docker)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Containers:                                                         │
│  • frontend     : React app (port 5173)                             │
│  • backend      : FastAPI server (port 8000)                        │
│  • postgres     : PostgreSQL 15 (port 5432)                         │
│  • pgadmin      : Database admin (port 5050)                        │
│                                                                       │
│  Orchestration: Docker Compose                                       │
│  CI/CD: GitHub Actions → AWS ECS                                    │
│  Monitoring: CloudWatch                                              │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flux de Données

### 1. 📚 Génération de Parcours d'Apprentissage

```
User → Frontend → Backend API → IA Service → Google Gemini
                                      ↓
                                   Database
                                      ↓
                              Parcours_Apprentissage
                              Reponse_IA
                              Session_Apprentissage
                                      ↓
                              Carbon Service
                                      ↓
                              Empreinte_Carbone
                                      ↓
                              Tree Planting API
                                      ↓
                              Plantation_Arbres
```

**Étapes détaillées:**
1. 👤 Utilisateur saisit : Module, Sous-module, Niveau, Description
2. 🔐 Authentification JWT vérifiée
3. 🤖 Backend appelle Google Gemini 2.5 Flash avec le prompt personnalisé
4. 💾 Sauvegarde du parcours généré et de la réponse IA
5. 🌍 Calcul de l'empreinte carbone (CO2, énergie, équivalent arbres)
6. 🌳 Appel à l'API de plantation d'arbres pour compensation
7. 📊 Retour au frontend avec le contenu et les métriques

### 2. 🔐 Authentification

```
User → Login Form → Backend → Verify Password → Generate JWT Token
                                  ↓
                              Database
                                  ↓
                              Return Token
                                  ↓
                              Store in localStorage
```

### 3. 🌍 Suivi de l'Impact Carbone

```
Session Start → Calculate CO2 → Save to DB → Display to User
                     ↓
              Plant Trees API
                     ↓
              Track Compensation
```

---

## 🛠️ Technologies Détaillées

### Frontend
- **React 18** : Framework UI
- **Vite** : Build tool rapide
- **D3.js** : Visualisations de données
- **React Router** : Navigation
- **Fetch API** : Requêtes HTTP

### Backend
- **FastAPI** : Framework API moderne et rapide
- **Python 3.10+** : Langage principal
- **Uvicorn** : ASGI server
- **Pydantic** : Validation de données
- **SQLAlchemy 2.0** : ORM
- **Alembic** : Migrations de base de données
- **PyJWT** : Authentication JWT
- **Passlib + Bcrypt** : Hashage des mots de passe
- **google-generativeai** : SDK Google Gemini

### Database
- **PostgreSQL 15** : Base de données relationnelle
- **pgAdmin 4** : Interface d'administration

### DevOps
- **Docker** : Conteneurisation
- **Docker Compose** : Orchestration locale
- **GitHub Actions** : CI/CD
- **AWS ECS** : Déploiement cloud
- **CloudWatch** : Monitoring
- **SonarCloud** : Analyse de qualité

---

## 📊 Modèle de Données

### Relations
```
utilisateur (1) ──────────── (N) parcours_apprentissage
     │                              │
     │                              │
    (N)                            (N)
     │                              │
     └──────────── session_apprentissage
                         │
                         ├── (1) empreinte_carbone
                         │         │
                         │         └── (1) plantation_arbres
                         │
                         └── (N) reponse_ia
```

---

## 🔒 Sécurité

### Authentication
- **JWT (JSON Web Tokens)** pour l'authentification stateless
- **Bcrypt** pour le hashage sécurisé des mots de passe
- **Token expiration** après 30 jours
- **HTTPS** en production

### Authorization
- **Rôles** : User, Admin
- **Middleware de vérification** sur les routes protégées
- **Validation des inputs** avec Pydantic

### Environment Variables
```env
DB_HOST=postgres
DB_PORT=5432
DB_USER=greenadmin
DB_PASSWORD=***
DB_NAME=greenaisystem_db
GEMINI_API_KEY=***
ENV=dev|prod
```

---

## 🚀 Déploiement

### Local (Docker Compose)
```bash
docker-compose up --build
```

### Production (AWS ECS)
```
GitHub Push → GitHub Actions → Build Docker Images → Push to ECR → Deploy to ECS → CloudWatch Monitoring
```

---

## 📈 Métriques et KPIs

### Performance
- ⚡ Temps de réponse API < 2s
- 🚀 Temps de génération IA < 30s
- 💾 Disponibilité DB > 99.9%

### Impact Environnemental
- 🌍 CO2 calculé par session
- 🌳 Arbres plantés en temps réel
- 📊 Dashboard de suivi carbone

### Utilisation
- 👥 Nombre d'utilisateurs actifs
- 📚 Parcours générés par jour
- 🎯 Taux de complétion des parcours

---

## 🌱 Vision Future

### Fonctionnalités Prévues
1. 🎓 **Gamification** : Badges, points, classements
2. 📱 **Application Mobile** : React Native
3. 🌐 **Multilingue** : Support FR, EN, ES, AR
4. 🤝 **Collaboration** : Partage de parcours
5. 🔬 **Analytics avancées** : ML pour recommandations
6. 🌳 **Partenariats** : ONG de reforestation

### Technologies Futures
- **Kubernetes** : Orchestration à grande échelle
- **GraphQL** : API plus flexible
- **Redis** : Cache distribué
- **Elasticsearch** : Recherche avancée

---

## 📞 Contact & Contribution

Pour contribuer au projet :
1. 🍴 Fork le repository
2. 🌿 Créer une branche feature
3. 💻 Développer et tester
4. 📝 Créer une Pull Request

**Chaque ligne de code contribue à mieux apprendre et préserver notre planète 🌍🌱**
