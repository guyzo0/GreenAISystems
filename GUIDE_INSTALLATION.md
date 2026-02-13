# 🚀 Guide d'installation - GreenAISystems

Pour faire fonctionner le projet sur ton ordinateur, suis ces étapes simples.

## 1. Prérequis
Assure-toi d'avoir installé :
- **Docker Desktop** (Télécharge-le sur [docker.com](https://www.docker.com/products/docker-desktop/))

## 2. Configuration (Clé API)
Le projet utilise l'IA de Google (Gemini) pour générer les parcours.
1. Ouvre le fichier `.env` à la racine du projet.
2. Si tu n'as pas de clé, tu peux en créer une gratuitement ici : [Google AI Studio](https://aistudio.google.com/app/apikey).
3. Remplace la valeur de `GEMINI_API_KEY` par ta propre clé :
   ```env
   GEMINI_API_KEY=Ta_Clé_Ici
   ```

## 3. Lancement du projet ▶️
1. Ouvre un terminal (ou PowerShell) dans le dossier du projet.
2. Lance la commande suivante :
   ```bash
   docker-compose up --build
   ```
3. Patiente pendant que Docker télécharge et configure tout le système (cela peut prendre quelques minutes au premier lancement).

## 4. Accès à l'application
Une fois que le terminal affiche que les serveurs sont prêts :
- **🌍 Application (Frontend)** : [http://localhost:5173](http://localhost:5173)
- **⚙️ API (Backend Docs)** : [http://localhost:8000/docs](http://localhost:8000/docs)
- **🐘 Base de données (pgAdmin)** : [http://localhost:80](http://localhost:80) (Login: `admin@admin.com`, Pass: `admin`)

---
### 🌱 Bon apprentissage écologique !
Si tu as un bug, vérifie que Docker Desktop est bien lancé.
