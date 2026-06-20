from fastapi import FastAPI

from app.database.connection import engine
from app.database.base import Base

import app.models.system_info
import app.models.room
import app.models.guest
import app.models.stay
import app.models.guest_stay

from app.api.system_info import router as system_info_router
from app.api.room import router as room_router
from app.api.guest import router as guest_router
from app.api.stay import router as stay_router
from app.api.guest_stay import router as guest_stay_router

app = FastAPI()

app.include_router(system_info_router)
app.include_router(room_router)
app.include_router(guest_router)
app.include_router(stay_router)
app.include_router(guest_stay_router)


@app.get("/", tags = ["Health Check"])
def root():
    return {
        "application": "HelloStay",
        "version": "1.0.0",
        "message": "Backend server is running successfully"
    }