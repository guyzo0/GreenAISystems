from app.database import Base, IDMixin, TimestampMixin
from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

class Utilisateur(Base, IDMixin, TimestampMixin):
    __tablename__ = "utilisateur"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(150), unique=True, nullable=False)
    password = Column(Text, nullable=False)
    nom = Column(String(100))
    prenom = Column(String(100))
    date_naissance = Column(Date)

    role_id = Column(Integer, ForeignKey("role.id"))

    role = relationship("Role")
    sessions = relationship("SessionConnexion", back_populates="utilisateur")


