from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.utilisateur import Utilisateur
from app.dependencies import get_db, get_current_user
from app.repositories.session_apprentissageRepository import SessionApprentissageRepository

router = APIRouter(prefix="/apprentissage", tags=["ServiceAI"])

# @router.get("/dashboard/{path_id}")
# def get_dashboard(current_user: Utilisateur = Depends(get_current_user), path_id: int,
#                   db: Session = Depends(get_db)):

#     return SessionApprentissageRepository.get_learning_session(db, current_user, path_id)
    
