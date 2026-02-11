from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.schemas.utilisateurSchemas import UtilisateurCreate, UtilisateurUpdate
from app.repositories.utilisateurRepository import UtilisateurRepository
from app.repositories.roleRepository import RoleRepository

class UtilisateurService:

    @staticmethod
    def create_user(db: Session, payload: UtilisateurCreate):
        if UtilisateurRepository.get_by_email(db, payload.email):
            raise HTTPException(400, "Email already used")
        if UtilisateurRepository.exists_by_fullname(db, payload.prenom, payload.nom):
            raise HTTPException(400, "A user with this firstname and lastname already exists")
        user_role = RoleRepository.get_role_user(db)
        if not user_role:
            raise HTTPException(400, "No roles available")        
        payload_with_role = payload.model_copy(update={"role_id": user_role.id})
        return UtilisateurRepository.create(db, payload_with_role)

    @staticmethod
    def list_users(db: Session):
        return UtilisateurRepository.get_all(db)

    @staticmethod
    def get_user(db: Session, user_id: int):
        user = UtilisateurRepository.get_by_id(db, user_id)
        if not user:
            raise HTTPException(404, "User not found")
        return user

    @staticmethod
    def update_user(db: Session, user_id: int, payload: UtilisateurUpdate):
        if payload.email:
            existing_email_user = UtilisateurRepository.get_by_email_for_update(db, payload.email, user_id)
            if existing_email_user:
                raise HTTPException(400, "Email already used by another user")
        user = UtilisateurRepository.get_by_id(db, user_id)
        if not user:
            raise HTTPException(404, "User not found")

        # Vérification firstname+lastname seulement si modifiés
        if payload.prenom or payload.nom:
            new_firstname = payload.prenom or user.prenom
            new_lastname = payload.lastname or user.nom
            if UtilisateurRepository.exists_by_fullname_update(db, user_id, new_firstname, new_lastname):
                raise HTTPException(400, "Another user already has this firstname + lastname")

        return UtilisateurRepository.update(db, user, payload)


    @staticmethod
    def delete_user(db: Session, utilisateur_id: int):
        user = UtilisateurRepository.get_by_id(db, utilisateur_id)
        if not user:
            raise HTTPException(404, "User not found")

        UtilisateurRepository.delete(db, user)
        return {"detail": "User deleted"}
