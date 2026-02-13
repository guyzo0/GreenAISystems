from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.services.iaService import IAService
from app.services.parcoursService import ParcoursService
from app.dependencies import get_db, get_current_user
from app.models.utilisateur import Utilisateur

router = APIRouter(prefix="/ia", tags=["IA"])

class GenerateRequest(BaseModel):
    module: str
    sous_module: str
    niveau: str
    description: str

class CarbonMetrics(BaseModel):
    co2_grammes: float
    energie_kwh: float
    equivalent_arbres: float

class GenerateResponse(BaseModel):
    parcours_id: int
    contenu: str
    module: str
    sous_module: str
    niveau: str
    modele: str
    carbon: CarbonMetrics

@router.post("/generate", response_model=GenerateResponse)
def generate_parcours(
    payload: GenerateRequest,
    current_user: Utilisateur = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Générer le parcours avec Gemini
    result = IAService.generate_parcours(
        module=payload.module,
        sous_module=payload.sous_module,
        niveau=payload.niveau,
        description=payload.description,
    )
    
    # Créer le titre du parcours
    titre = f"{payload.module} - {payload.sous_module} - Niveau {payload.niveau}"
    
    # Construire le prompt complet pour le sauvegarder
    prompt = f"""Module: {payload.module}
Spécialité: {payload.sous_module}
Niveau: {payload.niveau}
Description: {payload.description}"""
    
    # Sauvegarder le parcours dans la base de données
    parcours = ParcoursService.create_parcours(
        db=db,
        utilisateur_id=current_user.id,
        titre=titre,
        contenu_genere_ia=result["contenu"],
        prompt=prompt,
        tokens_utilises=0,  # TODO: Récupérer le nombre réel de tokens de Gemini
        modele_utilise=result["modele"]
    )
    
    # Récupérer l'empreinte carbone qui vient d'être créée (elle l'est dans create_parcours)
    # On peut aussi la recalculer ou la fetcher. Fetchons-la par session.
    from app.services.carbonService import CarbonService
    # On sait que create_parcours crée une session. On va chercher la dernière session de ce parcours.
    session = parcours.sessions[0]
    empreinte = CarbonService.get_empreinte_by_session(db, session.id)
    
    return {
        "parcours_id": parcours.id,
        "contenu": result["contenu"],
        "module": result["module"],
        "sous_module": result["sous_module"],
        "niveau": result["niveau"],
        "modele": result["modele"],
        "carbon": {
            "co2_grammes": empreinte.co2_grammes,
            "energie_kwh": empreinte.energie_kwh,
            "equivalent_arbres": empreinte.equivalent_arbres
        }
    }
