from fastapi import FastAPI

from app.db import init_db
from app.routers.investors import router as investors_router
from app.routers.commitments import router as commitments_router
from app.routers.ingest import router as ingest_router

app = FastAPI()

# Ensure tables exist
init_db()

# Root
@app.get("/")
def read_root():
    return {"message": "Welcome to the CRUD API"}

# Routers
app.include_router(investors_router)
app.include_router(commitments_router)
app.include_router(ingest_router)