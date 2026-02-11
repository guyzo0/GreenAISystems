from app.database import Base, IDMixin, TimestampMixin
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class SessionConnexion(Base, IDMixin, TimestampMixin):
    __tablename__ = "session_connexion"

    id = Column(Integer, primary_key=True)
    token = Column(Text, nullable=False)
    refresh_token = Column(Text, nullable=True)
    ip_adresse = Column(String(50), nullable=True)
    appareil = Column(String(100), nullable=True)
    expires_at = Column(DateTime)
    est_actif = Column(Boolean, default=True)

    utilisateur_id = Column(Integer, ForeignKey("utilisateur.id", ondelete="CASCADE"))

    utilisateur = relationship("Utilisateur", back_populates="sessions")

