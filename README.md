# GreenAISystems
### 🌱 EcoLearn AI: Plateforme d’apprentissage écologique pilotée par l’IA

GreenAISystems est une plateforme innovante qui génère des parcours d’apprentissage personnalisés grâce à l’intelligence artificielle, tout en mesurant et compensant automatiquement l’empreinte carbone de chaque session via la plantation d’arbres.

## I. Vision du projet

`Apprendre de manière intelligente, personnalisée et responsable.`

GreenAISystems combine :

  - IA générative pour l’apprentissage adaptatif
  - Calcul d’empreinte carbone en temps réel
  - Visualisation de l’impact environnemental
  - DevOps moderne pour un déploiement fiable et scalable

## II. Fonctionnalités principales
### 1) Apprentissage par IA 
  - Génération de parcours pédagogiques personnalisés
  - Adaptation du contenu selon le niveau et la progression
  - API FastAPI intégrant OpenAI GPT

### 2) Impact environnemental
  - Calcul automatique de l’empreinte carbone par session
  - Historique carbone par utilisateur
  - Compensation via API de plantation d’arbres

### 3) Interface utilisateur
  - Dashboard React
  - Visualisations interactives avec D3.js
  - Suivi des progrès et de l’impact écologique

### 4) DevOps & Qualité
  - Conteneurisation Docker
  - CI/CD avec GitHub Actions
  - Déploiement AWS ECS
  - Monitoring CloudWatch
  - Analyse qualité SonarCloud

## III. Architecture technique
### 1) Frontend 
        (React + D3.js)

### 2) Backend API (FastAPI)
      - Service Learning (OpenAI GPT)
      - Service Carbone
      - Auth & Sécurité (JWT)
  
### 3) Base de données (PostgreSQL)

## IV. Stack technique
### Domaine	                      Technologies
Backend	                          FastAPI, Python
IA	                              OpenAI GPT
Frontend	                        React, D3.js
Base de données	                  PostgreSQL
DevOps	                          Docker, GitHub Actions
Cloud	                            AWS ECS, CloudWatch
Qualité	                          Pytest, SonarCloud

## V. Installation et lancement local
### 1) Prérequis
  - Docker & Docker Compose
  - Python 3.10+
  - Node.js 18+
  - Compte OpenAI (clé API)

### 2) Variables d’environnement
Créer un fichier .env à la racine :

`OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://user:password@db:5432/ecolearn
JWT_SECRET=your_jwt_secret`

### 3) Lancer le projet ▶️
`docker-compose up --build`

  - API : http://localhost:8000/docs
  - Frontend : http://localhost:5173

## 🧪 Tests
`docker-compose exec api pytest`

## 🔄 CI/CD
Le pipeline GitHub Actions comprend :
  - Build
  - Tests automatisés
  - Analyse qualité (SonarCloud)
  - Déploiement AWS ECS

## 📋 Méthodologie de gestion de projet
Le projet est conduit selon l'agilité Scrum :
  - Sprints de 2 semaines
  - Product Backlog priorisé
  - Livraison incrémentale
  - Feedback continu

## 🤝 Contribution au projet
1. Fork le projet
2. Crée une branche (feature/ma-feature)
3. Commit (git commit -m "Ajout fonctionnalité")
4. Push (git push origin feature/ma-feature)
5. Ouvre une Pull Request

## 📄 Licence
Projet sous licence MIT – libre d’utilisation et de modification.

##🌍 Impact
  - Chaque ligne de code contribue à :
  - mieux apprendre
  - mieux comprendre son impact
  - agir pour la planète 🌱
