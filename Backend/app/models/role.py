from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base, IDMixin, TimestampMixin

class Role(Base, IDMixin, TimestampMixin):
    __tablename__ = "role"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(50), unique=True, nullable=False)