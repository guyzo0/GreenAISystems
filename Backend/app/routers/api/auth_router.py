# app/api/v1/routers/auth_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.utilisateurSchemas import UtilisateurLoginOut, UtilisateurLogin
from app.models.utilisateur import Utilisateur
from app.core.auth.auth import create_user_session
from app.dependencies import get_db
from app.core.security import verify_password
from app.dependencies import get_current_session

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login", response_model=UtilisateurLoginOut)
def login(payload: UtilisateurLogin, db: Session = Depends(get_db)):
    user = db.query(Utilisateur).filter(Utilisateur.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(401, "Invalid email or password")
    
    session = create_user_session(db, user)
    return {"token": session.token, "utilisateur_id": user.id, "email": user.email, "expires_at": session.expires_at}


@router.post("/logout")
def logout(current_session = Depends(get_current_session), db: Session = Depends(get_db)):

    db.delete(current_session)  # suppression du token en base
    db.commit()

    return {"message": "Successfully logged out"}