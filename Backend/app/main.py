from fastapi import FastAPI
from app.core.middleware.middleware import setup_middlewares
from app.routers.api import api_router
from app.database import Base, engine

app = FastAPI(title="Green AI Systems API")
# DB
Base.metadata.create_all(bind=engine)

# Middlewares CORS
setup_middlewares(app)



# Routes API
app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {"status": "API FastAPI opérationnelle 🚀"}

@app.get("/health")
def health():
    return {"ok": True}