from sqlalchemy.orm import Session
from app.models.parcours_apprentissage import ParcoursApprentissage
from app.models.session_apprentissage import SessionApprentissage
from app.models.reponse_ia import ReponseIA
from datetime import datetime
from fastapi import HTTPException


class ParcoursService:
    
    @staticmethod
    def create_parcours(
        db: Session,
        utilisateur_id: int,
        titre: str,
        contenu_genere_ia: str,
        prompt: str,
        tokens_utilises: int,
        modele_utilise: str
    ) -> ParcoursApprentissage:
        """
        Crée un nouveau parcours d'apprentissage et sauvegarde la réponse IA
        """
        # Créer le parcours
        parcours = ParcoursApprentissage(
            titre=titre,
            contenu_genere_ia=contenu_genere_ia,
            utilisateur_id=utilisateur_id,
            date_creation=datetime.utcnow()
        )
        
        db.add(parcours)
        db.flush()  # Pour obtenir l'ID du parcours
        
        # Créer une session d'apprentissage associée
        session = SessionApprentissage(
            debut=datetime.utcnow(),
            fin=datetime.utcnow(),
            duree_minutes=0,  # Sera mis à jour plus tard si nécessaire
            utilisateur_id=utilisateur_id,
            parcours_id=parcours.id
        )
        
        db.add(session)
        db.flush()  # Pour obtenir l'ID de la session
        
        # Sauvegarder la réponse IA
        reponse_ia = ReponseIA(
            prompt=prompt,
            reponse=contenu_genere_ia,
            tokens_utilises=tokens_utilises,
            modele=modele_utilise,
            session_id=session.id,
            date_creation=datetime.utcnow()
        )
        
        db.add(reponse_ia)
        
        # 🌍 Calculer et sauvegarder l'empreinte carbone
        from app.services.carbonService import CarbonService
        CarbonService.create_empreinte(
            db=db,
            session_id=session.id,
            tokens_utilises=tokens_utilises,
            duree_minutes=0,
            nombre_requetes=1
        )
        
        db.commit()
        db.refresh(parcours)
        
        return parcours
    
    @staticmethod
    def get_parcours_by_user(db: Session, utilisateur_id: int, limit: int = 50):
        """
        Récupère tous les parcours d'un utilisateur
        """
        return db.query(ParcoursApprentissage)\
            .filter(ParcoursApprentissage.utilisateur_id == utilisateur_id)\
            .order_by(ParcoursApprentissage.date_creation.desc())\
            .limit(limit)\
            .all()
    
    @staticmethod
    def get_parcours_by_id(db: Session, parcours_id: int, utilisateur_id: int):
        """
        Récupère un parcours spécifique (avec vérification de propriété)
        """
        parcours = db.query(ParcoursApprentissage)\
            .filter(ParcoursApprentissage.id == parcours_id)\
            .first()
        
        if not parcours:
            raise HTTPException(404, "Parcours non trouvé")
        
        if parcours.utilisateur_id != utilisateur_id:
            raise HTTPException(403, "Accès interdit à ce parcours")
        
        return parcours
    
    @staticmethod
    def delete_parcours(db: Session, parcours_id: int, utilisateur_id: int):
        """
        Supprime un parcours (avec vérification de propriété)
        """
        parcours = ParcoursService.get_parcours_by_id(db, parcours_id, utilisateur_id)
        
        db.delete(parcours)
        db.commit()
        
        return {"message": "Parcours supprimé avec succès"}
    
    @staticmethod
    def get_stats_by_user(db: Session, utilisateur_id: int):
        """
        Récupère les statistiques d'un utilisateur
        """
        total_parcours = db.query(ParcoursApprentissage)\
            .filter(ParcoursApprentissage.utilisateur_id == utilisateur_id)\
            .count()
        
        total_sessions = db.query(SessionApprentissage)\
            .filter(SessionApprentissage.utilisateur_id == utilisateur_id)\
            .count()
        
        # Temps total d'apprentissage
        sessions = db.query(SessionApprentissage)\
            .filter(SessionApprentissage.utilisateur_id == utilisateur_id)\
            .all()
        
        temps_total_minutes = sum(s.duree_minutes or 0 for s in sessions)
        
        return {
            "total_parcours": total_parcours,
            "total_sessions": total_sessions,
            "temps_total_minutes": temps_total_minutes,
            "temps_total_heures": round(temps_total_minutes / 60, 2)
        }
