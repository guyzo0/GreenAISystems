from sqlalchemy.orm import sessionmaker, declarative_base
import os
from sqlalchemy import Column, Integer, DateTime, String, create_engine
from datetime import datetime
import uuid

class IDMixin:
    id = Column(Integer, primary_key=True, index=True)


class TimestampMixin:
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class UUIDMixin:
    token = Column(String(64), default=lambda: uuid.uuid4().hex, unique=True)

# DATABASE_URL = "postgresql://postgres:admin@localhost/ecolearn_ai"
DATABASE_URL = os.environ["DATABASE_URL"]

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()
