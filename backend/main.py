from fastapi import FastAPI

from app.db import init_db
from app.routers.investors import router as investors_router
from app.routers.commitments import router as commitments_router
from app.routers.ingest import router as ingest_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure tables exist
init_db()


@app.get("/")
def read_root():
    return {"message": "Welcome to the CRUD API"}


# Routers
app.include_router(investors_router)
app.include_router(commitments_router)
app.include_router(ingest_router)