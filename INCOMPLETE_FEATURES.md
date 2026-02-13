# 🚧 Fonctionnalités Incomplètes - GreenAISystems

## 📊 État Actuel du Projet

### ✅ **Fonctionnalités IMPLÉMENTÉES**

#### Backend
- ✅ **Authentification & Sécurité**
  - Login/Register avec JWT
  - Hashage des mots de passe (Bcrypt)
  - Middleware de vérification de token
  - Rôles (User/Admin)

- ✅ **Gestion Utilisateurs**
  - CRUD utilisateurs
  - Profil utilisateur
  - Mise à jour des informations

- ✅ **Génération IA**
  - Intégration Google Gemini 2.5 Flash
  - Génération de parcours d'apprentissage personnalisés
  - Retry logic avec exponential backoff
  - Gestion des erreurs de quota

- ✅ **Base de Données**
  - Modèles SQLAlchemy complets
  - Relations entre tables
  - Migrations Alembic

#### Frontend
- ✅ **Pages principales**
  - Home
  - Login/Register
  - Dashboard (générateur de parcours)
  - Settings (modification profil)

- ✅ **Interface utilisateur**
  - Design moderne et responsive
  - Formulaires de génération IA
  - Affichage des parcours générés
  - Messages d'erreur/succès

#### DevOps
- ✅ **Conteneurisation**
  - Docker Compose avec 4 services
  - PostgreSQL + pgAdmin
  - Hot reload en dev

---

## ❌ **Fonctionnalités MANQUANTES ou INCOMPLÈTES**

### 🔴 PRIORITÉ HAUTE - Fonctionnalités Cœur

#### 1. **Calcul d'Empreinte Carbone** 🌍
**Status**: ❌ Modèle DB existe, mais AUCUNE logique implémentée

**Ce qui manque:**
- [ ] Service `carbonService.py` pour calculer le CO2
- [ ] Router `carbon_router.py` avec endpoints:
  - `POST /api/carbon/calculate` - Calculer l'empreinte d'une session
  - `GET /api/carbon/history/{user_id}` - Historique carbone utilisateur
  - `GET /api/carbon/stats` - Statistiques globales
- [ ] Logique de calcul:
  - CO2 par token Gemini utilisé
  - Énergie consommée (kWh)
  - Équivalent en arbres
- [ ] Sauvegarde automatique dans `empreinte_carbone` table
- [ ] Affichage dans le Dashboard frontend

**Impact**: 🔴 **CRITIQUE** - C'est une fonctionnalité différenciante du projet !

---

#### 2. **Plantation d'Arbres & Compensation** 🌳
**Status**: ❌ Modèle DB existe, mais AUCUNE intégration API

**Ce qui manque:**
- [ ] Service `treePlantingService.py`
- [ ] Intégration d'une API tierce (ex: Treedom, One Tree Planted)
- [ ] Router `tree_router.py` avec endpoints:
  - `POST /api/trees/plant` - Déclencher une plantation
  - `GET /api/trees/history/{user_id}` - Historique plantations
  - `GET /api/trees/total` - Total d'arbres plantés
- [ ] Logique de compensation automatique après chaque session
- [ ] Système de paiement ou crédits pour plantation
- [ ] Certificats de plantation

**Impact**: 🔴 **CRITIQUE** - Fonctionnalité unique et écologique !

---

#### 3. **Gestion des Parcours & Sessions** 📚
**Status**: ⚠️ Modèles DB existent, mais logique partielle

**Ce qui manque:**
- [ ] Service `parcoursService.py` pour gérer les parcours
- [ ] Router `parcours_router.py` avec endpoints:
  - `GET /api/parcours/{user_id}` - Liste des parcours d'un utilisateur
  - `GET /api/parcours/{parcours_id}` - Détails d'un parcours
  - `DELETE /api/parcours/{parcours_id}` - Supprimer un parcours
  - `PUT /api/parcours/{parcours_id}` - Modifier un parcours
- [ ] **Sauvegarde des parcours générés** dans la DB
  - Actuellement, le parcours est généré mais PAS sauvegardé !
- [ ] Service `sessionService.py` pour tracker les sessions
- [ ] Enregistrement automatique des sessions (début, fin, durée)
- [ ] Calcul de l'empreinte carbone par session

**Impact**: 🔴 **HAUTE** - Sans sauvegarde, impossible de suivre l'historique !

---

#### 4. **Historique & Analytics** 📊
**Status**: ❌ Aucune page frontend

**Ce qui manque:**
- [ ] Page `History.jsx` pour afficher:
  - Liste des parcours générés
  - Sessions d'apprentissage
  - Temps total passé
  - CO2 généré et compensé
- [ ] Page `Analytics.jsx` ou section Dashboard avec:
  - Graphiques D3.js (courbes CO2, arbres plantés)
  - KPIs (parcours/mois, temps moyen, impact carbone)
  - Comparaison avec autres utilisateurs
- [ ] Endpoints backend associés

**Impact**: 🔴 **HAUTE** - Essentiel pour la transparence environnementale

---

### 🟠 PRIORITÉ MOYENNE - Amélioration UX

#### 5. **Visualisations D3.js** 📈
**Status**: ❌ Mentionné dans le README mais non implémenté

**Ce qui manque:**
- [ ] Graphiques interactifs:
  - Courbe d'évolution CO2 dans le temps
  - Arbres plantés (compteur animé)
  - Diagramme circulaire des modules étudiés
- [ ] Dashboard visuel avec métriques en temps réel
- [ ] Animations et transitions

**Impact**: 🟠 **MOYENNE** - Améliore l'engagement utilisateur

---

#### 6. **Réponses IA & Logs** 🤖
**Status**: ⚠️ Modèle DB existe mais pas utilisé

**Ce qui manque:**
- [ ] Sauvegarde de chaque réponse IA dans `reponse_ia` table:
  - Prompt envoyé
  - Réponse reçue
  - Tokens utilisés
  - Modèle utilisé
  - Timestamp
- [ ] Endpoint pour consulter l'historique des réponses
- [ ] Recherche dans les anciennes réponses
- [ ] Export des réponses (PDF, JSON)

**Impact**: 🟠 **MOYENNE** - Utile pour le debugging et analytics

---

#### 7. **Gestion des Cours** 📖
**Status**: ❌ Modèle DB existe mais jamais utilisé

**Ce qui manque:**
- [ ] Le modèle `Cours` et `parcours_cours` (table de liaison) ne sont jamais utilisés
- [ ] Service pour gérer des cours prédéfinis
- [ ] Possibilité d'associer des cours aux parcours
- [ ] CRUD complet pour les cours

**Décision à prendre**: Garder cette fonctionnalité ou la retirer ?

**Impact**: 🟢 **BASSE** - Peut-être hors scope du MVP

---

#### 8. **Historique API** 📡
**Status**: ❌ Modèle DB existe mais pas utilisé

**Ce qui manque:**
- [ ] Tracking de tous les appels API (endpoint, méthode, statut, durée)
- [ ] Logs pour debugging
- [ ] Monitoring des performances

**Impact**: 🟢 **BASSE** - Utile pour devops mais pas critique

---

### 🟢 PRIORITÉ BASSE - Nice to Have

#### 9. **CI/CD & Déploiement AWS** ☁️
**Status**: ❌ Mentionné mais non implémenté

**Ce qui manque:**
- [ ] GitHub Actions workflow
- [ ] Configuration AWS ECS
- [ ] Terraform/CloudFormation pour IaC
- [ ] Monitoring CloudWatch
- [ ] SonarCloud pour qualité de code

**Impact**: 🟢 **BASSE** - Important pour production, mais pas pour le MVP

---

#### 10. **Tests Automatisés** 🧪
**Status**: ❌ Aucun test

**Ce qui manque:**
- [ ] Tests unitaires (Pytest)
- [ ] Tests d'intégration
- [ ] Tests E2E (Playwright/Cypress)
- [ ] Coverage > 80%

**Impact**: 🟢 **BASSE** - Critique pour production, mais MVP peut fonctionner sans

---

#### 11. **Admin Dashboard** 👑
**Status**: ❌ Rôle admin existe, mais pas d'interface

**Ce qui manque:**
- [ ] Page admin pour:
  - Voir tous les utilisateurs
  - Statistiques globales
  - Modération du contenu
  - Gestion des plantations
- [ ] Protection des routes admin

**Impact**: 🟢 **BASSE** - Utile mais pas essentiel

---

#### 12. **Notifications & Emails** 📧
**Status**: ❌ Non implémenté

**Ce qui manque:**
- [ ] Service email (SendGrid, Mailgun)
- [ ] Email de bienvenue
- [ ] Notifications de plantation d'arbres
- [ ] Rappels de sessions
- [ ] Newsletter écologique

**Impact**: 🟢 **BASSE** - Améliore l'engagement

---

## 📋 Plan d'Action Recommandé

### 🎯 Phase 1 - MVP Fonctionnel (2-3 semaines)
**Objectif**: Avoir un produit minimal mais complet

1. ✅ **Sauvegarde des parcours générés** (1 jour)
   - Modifier `ia_router.py` pour sauvegarder dans DB
   - Créer `ParcoursService`

2. ✅ **Calcul d'empreinte carbone** (3 jours)
   - Créer `carbonService.py`
   - Implémenter formules de calcul CO2
   - Endpoints API
   - Affichage dans Dashboard

3. ✅ **Historique des parcours** (2 jours)
   - Page `History.jsx`
   - Endpoint `/api/parcours/{user_id}`
   - Liste des parcours avec détails

4. ✅ **Visualisation D3.js basique** (2 jours)
   - Un graphique simple (CO2 dans le temps)
   - Compteur d'arbres animé

### 🎯 Phase 2 - Fonctionnalités Différenciantes (2-3 semaines)

5. ✅ **Intégration API plantation d'arbres** (5 jours)
   - Recherche et choix de l'API
   - Intégration technique
   - Tests et validation
   - Frontend pour afficher les plantations

6. ✅ **Analytics avancées** (3 jours)
   - Page complète avec tous les graphiques
   - KPIs et métriques
   - Export de données

### 🎯 Phase 3 - Production Ready (2 semaines)

7. ✅ **Tests automatisés** (5 jours)
   - Tests backend (Pytest)
   - Tests frontend (Vitest)
   - Coverage minimum 70%

8. ✅ **CI/CD** (3 jours)
   - GitHub Actions
   - Déploiement automatique

9. ✅ **Monitoring & Logs** (2 jours)
   - CloudWatch ou équivalent
   - Alertes

---

## 🎨 Améliorations UX/UI Recommandées

### Frontend
- [ ] **Loading states** plus élaborés (skeleton screens)
- [ ] **Animations** de transition entre pages
- [ ] **Dark mode** (mentionné dans le design)
- [ ] **Responsive mobile** (à vérifier et améliorer)
- [ ] **PWA** (Progressive Web App) pour installation
- [ ] **Tooltips** et aide contextuelle
- [ ] **Notifications in-app** (toasts)

### Backend
- [ ] **Rate limiting** sur les endpoints IA
- [ ] **Caching** avec Redis pour réponses fréquentes
- [ ] **Compression** des réponses API
- [ ] **Pagination** sur les listes longues
- [ ] **Filtres & Recherche** avancés

---

## 🔧 Bugs & Problèmes Techniques Potentiels

### À vérifier
- [ ] **Gestion des erreurs** uniformisée
- [ ] **Validation des inputs** complète
- [ ] **Gestion des tokens expirés** (refresh tokens ?)
- [ ] **Sécurité CORS** pour production
- [ ] **Variables d'environnement** pour tous les secrets
- [ ] **Migrations DB** pour déploiement
- [ ] **Cleanup des données** (soft delete vs hard delete)

---

## 📊 Résumé Statistique

### Implémentation Globale
```
Modules Backend:      60% ✅ (6/10)
Modules Frontend:     50% ✅ (3/6)
Services Core:        40% ✅ (2/5)
Fonctionnalités Clés: 30% ✅ (3/10)
Tests:                 0% ❌ (0/∞)
DevOps:               20% ✅ (Docker only)
```

### Priorités
- 🔴 **3 fonctionnalités CRITIQUES** à implémenter
- 🟠 **4 fonctionnalités MOYENNES** recommandées
- 🟢 **5 fonctionnalités BASSES** optionnelles

---

## 💡 Recommandations Stratégiques

### Pour un MVP rapide (1 mois)
**Focus sur**: Calcul carbone + Sauvegarde parcours + Historique + 1 graphique D3.js

### Pour une version complète (3 mois)
**Ajouter**: Plantation arbres + Analytics + Tests + CI/CD

### Pour une version production (6 mois)
**Ajouter**: Admin, Monitoring, Optimisations, Marketing

---

**Dernière mise à jour**: 2026-02-13  
**Statut du projet**: 🟡 MVP en développement actif
