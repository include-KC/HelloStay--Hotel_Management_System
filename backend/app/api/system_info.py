from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.system_info import SystemInfo

router = APIRouter(
    tags = ["System Info"]
)

@router.get("/system-info")
def get_system_info(db: Session = Depends(get_db)):
    records = db.query(SystemInfo).all()

    return [
        {
            "id": record.id,
            "application_name": record.application_name,
            "version": record.version
        }
        for record in records
    ]


