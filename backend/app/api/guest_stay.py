from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.guest_stay import GuestStay
from app.schemas.guest_stay import GuestStayCreate, GuestStayResponse

router = APIRouter(
    prefix = "/guest-stays",
    tags = ["Guest Stays"]
)

@router.get("", response_model = GuestStayResponse)
def get_guest_stays(
    db: Session = Depends(get_db)
):
    guest_stays = db.query(GuestStay).all()
    return guest_stays