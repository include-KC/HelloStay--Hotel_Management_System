from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.system_info import SystemInfo

router = APIRouter(
    tags = ["System_Info"]
)

@router.get("/system-info")
def get_system_info():
    db: Session = SessionLocal()

    try:
        records = db.query(SystemInfo).all()

        return [
            {
                "id": record.id,
                "application_name": record.application_name,
                "version": record.version
            }
            for record in records
        ]

    finally:
        db.close()


