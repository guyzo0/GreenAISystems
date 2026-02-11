from sqlalchemy.orm import Session
from app.models.utilisateur import Utilisateur
from app.schemas.utilisateurSchemas import UtilisateurCreate, UtilisateurUpdate
from app.core.security import hash_password

class UtilisateurRepository:

    @staticmethod
    def get_all(db: Session):
        return db.query(Utilisateur).all()

    @staticmethod
    def get_by_id(db: Session, utilisateur_id: int):
        return db.query(Utilisateur).filter(Utilisateur.id == utilisateur_id).first()

    @staticmethod
    def get_by_email(db: Session, email: str):
        return db.query(Utilisateur).filter(Utilisateur.email == email).first()
    
    @staticmethod
    def get_by_email_for_update(db: Session, email: str, utilisateur_id: int):
        return db.query(Utilisateur).filter(Utilisateur.email == email, Utilisateur.id != utilisateur_id).first()

    @staticmethod
    def create(db: Session, payload: UtilisateurCreate):
        utilisateur = Utilisateur(
            email=payload.email,
            nom=payload.prenom,
            prenom=payload.nom,
            date_naissance=payload.date_naissance,
            password=hash_password(payload.password)
        )
        db.add(utilisateur)
        db.commit()
        db.refresh(utilisateur)
        return utilisateur

    @staticmethod
    def update(db: Session, utilisateur: Utilisateur, payload: UtilisateurUpdate):
        if payload.email is not None:
            utilisateur.email = payload.email
        if payload.prenom is not None:
            utilisateur.prenom = payload.prenom
        if payload.date_naissance is not None:
            utilisateur.date_naissance = payload.date_naissance
        if payload.nom is not None:
            utilisateur.nom = payload.nom
        if payload.password:
            utilisateur.password = hash_password(payload.password)

        db.commit()
        db.refresh(utilisateur)
        return utilisateur

    @staticmethod
    def delete(db: Session, utilisateur: Utilisateur):
        db.delete(utilisateur)
        db.commit()

    @staticmethod
    def exists_by_fullname(db: Session, prenom: str, nom: str) -> bool:
        return db.query(Utilisateur).filter(
            Utilisateur.prenom == prenom,
            Utilisateur.nom == nom
        ).first() is not None
    
    @staticmethod
    def exists_by_fullname_update(db: Session, utilisateur_id: int, prenom: str, nom: str) -> bool:
        return db.query(Utilisateur).filter(
            Utilisateur.prenom == prenom,
            Utilisateur.nom == nom,
            Utilisateur.id != utilisateur_id
        ).first() is not None