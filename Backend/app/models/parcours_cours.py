from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base, IDMixin, TimestampMixin

class ParcoursCours(Base, IDMixin, TimestampMixin):
    __tablename__ = "parcours_cours"

    id = Column(Integer, primary_key=True)
    ordre = Column(Integer)

    parcours_id = Column(Integer, ForeignKey("parcours_apprentissage.id", ondelete="CASCADE"))
    cours_id = Column(Integer, ForeignKey("cours.id", ondelete="CASCADE"))

    parcours = relationship("ParcoursApprentissage")
    cours = relationship("Cours")
