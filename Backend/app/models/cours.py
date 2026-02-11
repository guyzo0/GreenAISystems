from sqlalchemy import Column, Integer, String, ForeignKey, Text
from app.database import Base, IDMixin, TimestampMixin


class Cours(Base, IDMixin, TimestampMixin):
    __tablename__ = "cours"

    id = Column(Integer, primary_key=True)
    titre = Column(String(200))
    categorie = Column(String(100))
    niveau = Column(String(50))
    description = Column(Text)
