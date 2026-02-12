from sqlalchemy.orm import Session
from app.models.session_apprentissage import SessionApprentissage
from datetime import datetime
from app.core.carbon import CarbonCalculator
from app.models.utilisateur import Utilisateur
from app.models.cours import Cours
from app.schemas.learningSchemas import LearningRequest, LearningPathResponse
from app.services.geminiService import GeminiAIService
from app.config import GEMINI_API_KEY
import json
import re


class SessionApprentissageRepository:

    @staticmethod
    def start_learning_session(db: Session, current_user: Utilisateur, parcours_id: int):
        session = SessionApprentissage(
            utilisateur_id=current_user.id,
            parcours_id=parcours_id,
            debut=datetime.utcnow()
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session
    

    @staticmethod
    def get_learning_session(db: Session, current_user: Utilisateur, utilisateur_id: int):
        sessions = db.query(SessionApprentissage).filter(
            SessionApprentissage.utilisateur_id == current_user.id
        ).all()

        total_co2 = sum(s.co2_emission for s in sessions)
        total_energy = sum(s.energy_used for s in sessions)

        return {
            "total_sessions": len(sessions),
            "total_co2": total_co2,
            "total_energy": total_energy,
            "trees_planted": total_co2 
        }
    
    @staticmethod
    def end_learning_session(db: Session, current_user: Utilisateur, session_id: int):
        session = db.query(SessionApprentissage).get(session_id)
        session.fin = datetime.utcnow()
        duration = (session.debut - session.fin).seconds / 60

        energy = CarbonCalculator.calculate_energy(duration)
        co2 = CarbonCalculator.calculate_co2(energy)
        session.energy_used = energy
        session.co2_emission = co2

        db.commit()
        return {
            "duration": duration,
            "energy": energy,
            "co2": co2
        }
    
    
    @staticmethod
    def generate_learning_path(db: Session, current_user: Utilisateur, request: LearningRequest):

        prompt = "Crée un parcours pédagogique structuré avec pour "+"Titre: "+request.titre+\
        ", "+"Categorie: "+request.categorie+", "+"Niveau: "+request.niveau+", "+"Description: "\
        +request.description +"  Réponds STRICTEMENT en JSON valide sans texte supplémentaire et\
        respectant ceci un object contenant plusieurs objets modules dont les champs sont des string ou int ou datetime"
        content = GeminiAIService.generate_content(prompt)

        # Supprimer les balises ```json ``` si présentes
        cleaned = re.sub(r"```json|```", "", content).strip()
        format_data = json.loads(cleaned)
        return format_data
        flattened = []

        course_title = format_data["titre"]

        for module in format_data["module"]:
            module_title = module["titre"]
            module_description = module["description"]
            module_duration = module["duration_estimation"]

            for lesson in module["lessons"]:
                flattened.append({
                    "course_title": course_title,
                    "module_title": module_title,
                    "module_description": module_description,
                    "module_duration": module_duration,
                    "lesson_title": lesson["titre"],
                    "lesson_description": lesson["description"],
                    "lesson_duration": lesson["estimated_time"]
                })

        return flattened
    
        session = Cours(
            titre=request.titre,
            categorie=request.categorie,
            niveau=request.niveau,
            description=request.description,
            utilisateur_id=current_user.id
        )
        db.add(session)
        db.commit()
        db.refresh(session)