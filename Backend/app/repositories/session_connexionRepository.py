from sqlalchemy.orm import Session
from app.models.session_connexion import SessionConnexion
from app.models.utilisateur import Utilisateur
from datetime import datetime

class SessionRepository:

    @staticmethod
    def create_user_session(db: Session, token: str, Utilisateur: Utilisateur, expires_at: datetime):
        session = SessionConnexion(token=token, utilisateur_id=Utilisateur.id, expires_at=expires_at)
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def get_user_from_token(db: Session, token: str):
        return db.query(SessionConnexion).filter(
        SessionConnexion.token == token,
        SessionConnexion.expires_at > datetime.utcnow()
    ).first()
