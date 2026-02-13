import os
import time
import google.generativeai as genai
from fastapi import HTTPException

class IAService:

    @staticmethod
    def generate_parcours(module: str, sous_module: str, niveau: str, description: str) -> dict:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(500, "Clé API Gemini non configurée")

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("models/gemini-2.5-flash")

        prompt = f"""Tu es un assistant pédagogique expert. Génère un parcours d'apprentissage personnalisé.

Module : {module}
Spécialité : {sous_module}
Niveau de l'apprenant : {niveau}
Demande de l'apprenant : {description}

Réponds en français avec un parcours structuré comprenant :
1. **Objectifs d'apprentissage** (3-5 objectifs clairs)
2. **Plan du parcours** (étapes numérotées avec titres et descriptions)
3. **Ressources recommandées** (livres, sites, vidéos)
4. **Exercices pratiques** (2-3 exercices concrets)
5. **Conseils** pour progresser efficacement

Sois précis, pédagogique et encourageant. Utilise des emojis pour rendre le contenu engageant."""

        max_retries = 2
        retry_delay = 15  # Start with 15 seconds to avoid long frontend waits
        
        for attempt in range(max_retries):
            try:
                response = model.generate_content(prompt)
                return {
                    "contenu": response.text,
                    "module": module,
                    "sous_module": sous_module,
                    "niveau": niveau,
                    "modele": "gemini-2.5-flash",
                }
            except Exception as e:
                error_message = str(e)
                
                # Check if it's a quota error (429)
                if "429" in error_message or "quota" in error_message.lower():
                    if attempt < max_retries - 1:
                        # Wait before retrying
                        time.sleep(retry_delay)
                        retry_delay *= 2  # Exponential backoff
                        continue
                    else:
                        # Last attempt failed
                        raise HTTPException(
                            429,
                            "Quota API Gemini dépassé. Veuillez réessayer dans quelques minutes."
                        )
                else:
                    # Other errors
                    raise HTTPException(500, f"Erreur Gemini : {error_message}")
