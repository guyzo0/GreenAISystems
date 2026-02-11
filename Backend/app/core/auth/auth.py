# app/core/auth.py
import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.utilisateur import Utilisateur
from app.models.session_connexion import SessionConnexion
from Backend.app.repositories.session_connexionRepository import SessionRepository

TOKEN_EXPIRE_HOURS = 24  # token valide 24h

def create_user_session(db: Session, utilisateur: Utilisateur) -> SessionConnexion:
    token = str(uuid.uuid4())
    expires_at = datetime.utcnow() + timedelta(hours=TOKEN_EXPIRE_HOURS)
    print(utilisateur)
    return SessionRepository.create_user_session(db, token, utilisateur, expires_at)


def get_user_from_token(db: Session, token: str) -> Utilisateur | None:
    session = SessionRepository.get_user_from_token(db, token)
    if session:
        return session.utilisateur
    return None
