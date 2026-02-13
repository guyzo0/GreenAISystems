from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.parcoursService import ParcoursService
from app.dependencies import get_db, get_current_user
from app.models.utilisateur import Utilisateur
from pydantic import BaseModel
from datetime import datetime
from typing import List

router = APIRouter(prefix="/parcours", tags=["Parcours"])


class ParcoursResponse(BaseModel):
    id: int
    titre: str
    contenu_genere_ia: str
    date_creation: datetime
    utilisateur_id: int
    
    class Config:
        from_attributes = True


class StatsResponse(BaseModel):
    total_parcours: int
    total_sessions: int
    temps_total_minutes: int
    temps_total_heures: float


@router.get("/", response_model=List[ParcoursResponse])
def get_user_parcours(
    limit: int = 50,
    current_user: Utilisateur = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupère tous les parcours de l'utilisateur connecté
    """
    parcours = ParcoursService.get_parcours_by_user(db, current_user.id, limit)
    return parcours


@router.get("/stats", response_model=StatsResponse)
def get_user_stats(
    current_user: Utilisateur = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupère les statistiques de l'utilisateur
    """
    return ParcoursService.get_stats_by_user(db, current_user.id)


@router.get("/{parcours_id}", response_model=ParcoursResponse)
def get_parcours_detail(
    parcours_id: int,
    current_user: Utilisateur = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupère les détails d'un parcours spécifique
    """
    return ParcoursService.get_parcours_by_id(db, parcours_id, current_user.id)


@router.delete("/{parcours_id}")
def delete_parcours(
    parcours_id: int,
    current_user: Utilisateur = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Supprime un parcours
    """
    return ParcoursService.delete_parcours(db, parcours_id, current_user.id)
