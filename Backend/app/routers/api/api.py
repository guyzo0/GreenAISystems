from fastapi import APIRouter
from app.routers.api.user_router import router as user_router
from app.routers.api.auth_router import router as auth_router
from app.routers.api.ia_router import router as ia_router
from app.routers.api.parcours_router import router as parcours_router
from app.routers.api.carbon_router import router as carbon_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(user_router)
api_router.include_router(ia_router)
api_router.include_router(parcours_router)
api_router.include_router(carbon_router)
