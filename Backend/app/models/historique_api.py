from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from app.database import Base, IDMixin, TimestampMixin
from datetime import datetime


class HistoriqueAPI(Base, IDMixin, TimestampMixin):
    __tablename__ = "historique_api"

    id = Column(Integer, primary_key=True)
    endpoint = Column(String(200))
    donnees_requete = Column(Text)
    statut_reponse = Column(Integer)
    date_creation = Column(DateTime, default=datetime.utcnow)

    utilisateur_id = Column(Integer, ForeignKey("utilisateur.id"))

    utilisateur = relationship("Utilisateur")