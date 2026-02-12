from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.utilisateur import Utilisateur
from app.models.parcours_apprentissage import ParcoursApprentissage
from app.dependencies import get_db, get_current_user
from app.repositories.session_apprentissageRepository import SessionApprentissageRepository
from app.schemas.learningSchemas import LearningPathResponse
from app.schemas.learningSchemas import LearningRequest, CoursCreate

router = APIRouter(prefix="/apprentissage", tags=["ServiceAI"])

@router.post("/learning-path")
def create_learning_path(
    request: CoursCreate,
    current_user: Utilisateur = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return SessionApprentissageRepository.generate_learning_path(db, current_user, request)


@router.post("/session/start/{session_id}")
def start_session(session_id: int,
    current_user: Utilisateur = Depends(get_current_user),
    db: Session = Depends(get_db)):

    return SessionApprentissageRepository.start_learning_session(db, current_user, session_id)


@router.post("/session/end/{session_id}")
def end_session(session_id: int,
    current_user: Utilisateur = Depends(get_current_user),
    db: Session = Depends(get_db)):

    return SessionApprentissageRepository.end_learning_session(db, current_user, session_id)

