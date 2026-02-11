from pydantic import BaseModel, EmailStr, field_validator, ValidationInfo, model_validator, Field
from datetime import datetime, date

class UtilisateurBase(BaseModel):
    email: EmailStr
    prenom: str | None = None
    nom: str | None = None

class UtilisateurCreate(UtilisateurBase):
    password: str
    password_confirm: str
    date_naissance: date

    @field_validator("password_confirm")
    def passwords_match(cls, v, info: ValidationInfo):
        password = info.data.get("password")
        if password is not None and v != password:
            raise ValueError("Passwords do not match")
        return v

class UtilisateurUpdate(BaseModel):
    email: EmailStr | None = None
    prenom: str | None = None
    nom: str | None = None
    password: str | None = None
    password_confirm: str | None = None
    date_naissance: date | None = None

    @model_validator(mode="after")
    def check_password_update(self):
        # Si password n'est pas envoyé → aucune validation nécessaire
        if self.password is None:
            return self

        # Si password est envoyé, password_confirm devient obligatoire
        if self.password_confirm is None:
            raise ValueError("password_confirm is required when updating password")

        # Vérifier que les deux correspondent
        if self.password != self.password_confirm:
            raise ValueError("Passwords do not match")

        return self

class UtilisateurOut(UtilisateurBase):
    id: int

    class Config:
        from_attributes = True


class UtilisateurLogin(BaseModel):
    email: EmailStr = Field(..., max_length=100)
    password: str = Field(..., min_length=3)


class UtilisateurLoginOut(BaseModel):
    token: str
    utilisateur_id: int
    email: EmailStr
    expires_at: datetime
