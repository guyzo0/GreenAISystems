from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.carbonService import CarbonService
from app.dependencies import get_db, get_current_user
from app.models.utilisateur import Utilisateur
from pydantic import BaseModel
from datetime import datetime
from typing import List

router = APIRouter(prefix="/carbon", tags=["Carbon"])


class CarbonStats(BaseModel):
    nombre_sessions: int
    total_co2_grammes: float
    total_co2_kg: float
    total_energie_kwh: float
    total_equivalent_arbres: float
    moyenne_co2_par_session: float


class CarbonHistoryItem(BaseModel):
    date: datetime
    duree_minutes: int
    co2_grammes: float
    energie_kwh: float
    equivalent_arbres: float


@router.get("/stats", response_model=CarbonStats)
def get_carbon_stats(
    current_user: Utilisateur = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupère les statistiques carbone de l'utilisateur
    """
    return CarbonService.get_total_empreinte_by_user(db, current_user.id)


@router.get("/history", response_model=List[CarbonHistoryItem])
def get_carbon_history(
    limit: int = 50,
    current_user: Utilisateur = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupère l'historique des empreintes carbone
    """
    return CarbonService.get_empreinte_history(db, current_user.id, limit)
