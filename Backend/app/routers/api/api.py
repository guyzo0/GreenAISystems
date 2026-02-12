from fastapi import APIRouter
from app.routers.api.user_router import router as user_router
from app.routers.api.auth_router import router as auth_router
from app.routers.api.session_apprentissage_router import router as session_apprentissage_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(user_router)
api_router.include_router(session_apprentissage_router)