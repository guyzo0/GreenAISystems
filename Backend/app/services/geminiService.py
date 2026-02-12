# app/services/ai_service.py

import httpx
from app.config import GEMINI_API_KEY


class GeminiAIService:
    def generate_content(prompt: str):
        base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
        headers = {
            "x-goog-api-key": GEMINI_API_KEY,
            "Content-Type": "application/json"
        }
        
        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt}]
                }
            ]
        }

        with httpx.Client(timeout=30.0) as client:
            response = client.post(
                url=base_url,
                headers=headers,
                json=payload
            )

        response.raise_for_status()
        data = response.json()

        try:
            return data["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError):
            raise ValueError("Réponse Gemini invalide")
