from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database import Base, IDMixin, TimestampMixin


class EmpreinteCarbone(Base, IDMixin, TimestampMixin):
    __tablename__ = "empreinte_carbone"

    id = Column(Integer, primary_key=True)
    co2_grammes = Column(Float)
    energie_kwh = Column(Float)
    equivalent_arbres = Column(Float)

    session_id = Column(Integer, ForeignKey("session_apprentissage.id"), unique=True)

    session = relationship("SessionApprentissage", back_populates="empreinte")
