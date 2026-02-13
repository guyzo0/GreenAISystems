from datetime import datetime
from pydantic import BaseModel
from pydantic import BaseModel,  Field

class LearningPathResponse(BaseModel):
    id: int
    topic: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class LearningRequest(BaseModel):
    topic: str = Field(..., min_length=3, example="Introduction to Python")
    level: str = Field(default="beginner", example="beginner")
    duration_minutes: int = Field(default=60, ge=10, le=600)

    class Config:
        from_attributes = True

class CoursCreate(BaseModel):
    titre: str = Field(..., min_length=3, max_length=200)
    categorie: str = Field(..., min_length=3, max_length=100)
    niveau: str = Field(..., example="debutant")
    description: str = Field(..., min_length=3, max_length=600)

    class Config:
        from_attributes = True