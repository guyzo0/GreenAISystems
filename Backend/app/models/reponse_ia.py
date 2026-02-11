from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from app.database import Base, IDMixin, TimestampMixin
from datetime import datetime
	
class ReponseIA(Base, IDMixin, TimestampMixin):
    __tablename__ = "reponse_ia"

    id = Column(Integer, primary_key=True)
    prompt = Column(Text)
    reponse = Column(Text)
    modele = Column(String(100))
    tokens_utilises = Column(Integer)
    date_creation = Column(DateTime, default=datetime.utcnow)

    session_id = Column(Integer, ForeignKey("session_apprentissage.id", ondelete="CASCADE"))

    session = relationship("SessionApprentissage")
