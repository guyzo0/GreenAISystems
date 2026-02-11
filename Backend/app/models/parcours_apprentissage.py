from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from app.database import Base, IDMixin, TimestampMixin
from datetime import datetime

class ParcoursApprentissage(Base, IDMixin, TimestampMixin):
    __tablename__ = "parcours_apprentissage"

    id = Column(Integer, primary_key=True)
    titre = Column(String(200))
    contenu_genere_ia = Column(Text)
    date_creation = Column(DateTime, default=datetime.utcnow)

    utilisateur_id = Column(Integer, ForeignKey("utilisateur.id"))

    utilisateur = relationship("Utilisateur")
    sessions = relationship("SessionApprentissage", back_populates="parcours")

