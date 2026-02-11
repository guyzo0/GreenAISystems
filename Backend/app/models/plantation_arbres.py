from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base, IDMixin, TimestampMixin
from datetime import datetime


class PlantationArbres(Base, IDMixin, TimestampMixin):
    __tablename__ = "plantation_arbres"

    id = Column(Integer, primary_key=True)
    nombre_arbres = Column(Integer)
    fournisseur_api = Column(String(100))
    date_plantation = Column(DateTime, default=datetime.utcnow)

    utilisateur_id = Column(Integer, ForeignKey("utilisateur.id"))

    utilisateur = relationship("Utilisateur")

	