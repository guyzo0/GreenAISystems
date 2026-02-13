from sqlalchemy.orm import Session
from app.models.empreinte_carbone import EmpreinteCarbone
from app.models.session_apprentissage import SessionApprentissage
from datetime import datetime
from fastapi import HTTPException


class CarbonService:
    """
    Service pour calculer et gérer l'empreinte carbone des sessions IA
    
    Formules basées sur des estimations de consommation énergétique :
    - 1 requête IA (Gemini) ≈ 0.5 Wh (0.0005 kWh)
    - 1 kWh ≈ 0.475 kg CO2 (moyenne mondiale)
    - 1 arbre absorbe ≈ 21 kg CO2/an
    """
    
    # Constantes de calcul
    ENERGIE_PAR_REQUETE_KWH = 0.0005  # 0.5 Wh
    CO2_PAR_KWH_GRAMMES = 475  # grammes
    CO2_PAR_ARBRE_PAR_AN_KG = 21  # kg
    
    @staticmethod
    def calculer_empreinte(
        tokens_utilises: int = 0,
        duree_minutes: int = 0,
        nombre_requetes: int = 1
    ) -> dict:
        """
        Calcule l'empreinte carbone d'une session IA
        
        Args:
            tokens_utilises: Nombre de tokens utilisés (approximatif)
            duree_minutes: Durée de la session en minutes
            nombre_requetes: Nombre de requêtes effectuées
            
        Returns:
            dict avec co2_grammes, energie_kwh, equivalent_arbres
        """
        # Calcul de l'énergie consommée
        # Base: énergie par requête
        energie_kwh = nombre_requetes * CarbonService.ENERGIE_PAR_REQUETE_KWH
        
        # Facteur additionnel basé sur les tokens (si disponible)
        if tokens_utilises > 0:
            # Estimation: 1000 tokens ≈ 0.0001 kWh supplémentaire
            energie_kwh += (tokens_utilises / 1000) * 0.0001
        
        # Facteur additionnel basé sur la durée (serveur actif)
        if duree_minutes > 0:
            # Estimation: serveur actif consomme 0.0001 kWh/minute
            energie_kwh += duree_minutes * 0.0001
        
        # Calcul du CO2 en grammes
        co2_grammes = energie_kwh * CarbonService.CO2_PAR_KWH_GRAMMES
        
        # Calcul de l'équivalent en arbres
        # Nombre d'arbres nécessaires pour compenser sur 1 an
        co2_kg = co2_grammes / 1000
        equivalent_arbres = co2_kg / CarbonService.CO2_PAR_ARBRE_PAR_AN_KG
        
        return {
            "energie_kwh": round(energie_kwh, 6),
            "co2_grammes": round(co2_grammes, 2),
            "equivalent_arbres": round(equivalent_arbres, 6)
        }
    
    @staticmethod
    def create_empreinte(
        db: Session,
        session_id: int,
        tokens_utilises: int = 0,
        duree_minutes: int = 0,
        nombre_requetes: int = 1
    ) -> EmpreinteCarbone:
        """
        Crée et sauvegarde une empreinte carbone pour une session
        """
        # Calculer les métriques
        metriques = CarbonService.calculer_empreinte(
            tokens_utilises=tokens_utilises,
            duree_minutes=duree_minutes,
            nombre_requetes=nombre_requetes
        )
        
        # Créer l'enregistrement
        empreinte = EmpreinteCarbone(
            session_id=session_id,
            co2_grammes=metriques["co2_grammes"],
            energie_kwh=metriques["energie_kwh"],
            equivalent_arbres=metriques["equivalent_arbres"]
        )
        
        db.add(empreinte)
        db.commit()
        db.refresh(empreinte)
        
        return empreinte
    
    @staticmethod
    def get_empreinte_by_session(db: Session, session_id: int):
        """
        Récupère l'empreinte carbone d'une session
        """
        return db.query(EmpreinteCarbone)\
            .filter(EmpreinteCarbone.session_id == session_id)\
            .first()
    
    @staticmethod
    def get_total_empreinte_by_user(db: Session, utilisateur_id: int):
        """
        Calcule l'empreinte carbone totale d'un utilisateur
        """
        # Récupérer toutes les sessions de l'utilisateur
        sessions = db.query(SessionApprentissage)\
            .filter(SessionApprentissage.utilisateur_id == utilisateur_id)\
            .all()
        
        session_ids = [s.id for s in sessions]
        
        # Récupérer toutes les empreintes de ces sessions
        empreintes = db.query(EmpreinteCarbone)\
            .filter(EmpreinteCarbone.session_id.in_(session_ids))\
            .all()
        
        # Calculer les totaux
        total_co2 = sum(e.co2_grammes for e in empreintes)
        total_energie = sum(e.energie_kwh for e in empreintes)
        total_arbres = sum(e.equivalent_arbres for e in empreintes)
        
        return {
            "nombre_sessions": len(empreintes),
            "total_co2_grammes": round(total_co2, 2),
            "total_co2_kg": round(total_co2 / 1000, 3),
            "total_energie_kwh": round(total_energie, 6),
            "total_equivalent_arbres": round(total_arbres, 4),
            "moyenne_co2_par_session": round(total_co2 / len(empreintes), 2) if empreintes else 0
        }
    
    @staticmethod
    def get_empreinte_history(db: Session, utilisateur_id: int, limit: int = 50):
        """
        Récupère l'historique des empreintes carbone d'un utilisateur
        """
        # Récupérer les sessions avec leurs empreintes
        sessions = db.query(SessionApprentissage)\
            .filter(SessionApprentissage.utilisateur_id == utilisateur_id)\
            .order_by(SessionApprentissage.debut.desc())\
            .limit(limit)\
            .all()
        
        history = []
        for session in sessions:
            empreinte = db.query(EmpreinteCarbone)\
                .filter(EmpreinteCarbone.session_id == session.id)\
                .first()
            
            if empreinte:
                history.append({
                    "date": session.debut,
                    "duree_minutes": session.duree_minutes,
                    "co2_grammes": empreinte.co2_grammes,
                    "energie_kwh": empreinte.energie_kwh,
                    "equivalent_arbres": empreinte.equivalent_arbres
                })
        
        return history
