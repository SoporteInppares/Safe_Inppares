from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import settings
from app.routers.denuncias import router as denuncias_router
from app.routers.admin import router as admin_router

app = FastAPI(title="INPPARES SafeReport API")
app.add_middleware(CORSMiddleware, allow_origins=[origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()], allow_credentials=False, allow_methods=["*"], allow_headers=["*"])
app.include_router(denuncias_router)
app.include_router(admin_router)


@app.get("/health")
def health():
    return {"status": "ok"}
