# app/dependencies.py
from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.core.auth.auth import get_user_from_token
from app.models.session_connexion import SessionConnexion
from datetime import datetime

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str | None = Header(default=None), db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")
    user = get_user_from_token(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return user

def get_current_session(token: str | None = Header(default=None), db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")
    
    session = db.query(SessionConnexion).filter(
        SessionConnexion.token == token,
        SessionConnexion.expires_at > datetime.utcnow()
    ).first()

    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return session