from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base, IDMixin, TimestampMixin

class SessionApprentissage(Base, IDMixin, TimestampMixin):
    __tablename__ = "session_apprentissage"

    id = Column(Integer, primary_key=True)
    debut = Column(DateTime)
    fin = Column(DateTime)
    duree_minutes = Column(Integer)

    utilisateur_id = Column(Integer, ForeignKey("utilisateur.id"))
    parcours_id = Column(Integer, ForeignKey("parcours_apprentissage.id"))

    utilisateur = relationship("Utilisateur")
    parcours = relationship("ParcoursApprentissage", back_populates="sessions")
    empreinte = relationship("EmpreinteCarbone", uselist=False, back_populates="session")
