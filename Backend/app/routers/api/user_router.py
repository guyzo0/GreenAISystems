from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.utilisateurSchemas import UtilisateurCreate, UtilisateurOut, UtilisateurUpdate
from app.services.utilisateurService import UtilisateurService
from app.dependencies import get_db, get_current_user
from app.models.utilisateur import Utilisateur

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UtilisateurOut)
def create_user(payload: UtilisateurCreate, db: Session = Depends(get_db)):
    return UtilisateurService.create_user(db, payload)

@router.get("/", response_model=list[UtilisateurOut])
def list_users(
    db: Session = Depends(get_db), 
    current_user: Utilisateur = Depends(get_current_user)
):
    return UtilisateurService.list_users(db)

@router.get("/{user_id}", response_model=UtilisateurOut)
def get_user(
    user_id: int, db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(get_current_user)
):
    return UtilisateurService.get_user(db, user_id)

@router.put("/{user_id}", response_model=UtilisateurOut)
def update_user(
    user_id: int, payload: UtilisateurUpdate, db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(get_current_user)
):
    return UtilisateurService.update_user(db, user_id, payload)

@router.delete("/{user_id}")
def delete_user(
    user_id: int, db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(get_current_user)
):
    return UtilisateurService.delete_user(db, user_id)
