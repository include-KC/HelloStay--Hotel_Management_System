from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.guest_stay import GuestStay
from app.schemas.guest_stay import GuestStayCreate, GuestStayResponse, GuestStayUpdate

router = APIRouter(
    prefix = "/guest-stays",
    tags = ["Guest Stays"]
)

@router.get("", response_model = List[GuestStayResponse])
def get_guest_stays(
    db: Session = Depends(get_db)
):
    guest_stays = db.query(GuestStay).all()
    
    return guest_stays


@router.post("", response_model = GuestStayResponse)
def create_guest_stay(
    guest_stay: GuestStayCreate,
    db: Session = Depends(get_db)
):
    new_guest_stay = GuestStay(
        guest_id=guest_stay.guest_id,
        stay_id=guest_stay.stay_id,
        is_primary_guest=guest_stay.is_primary_guest,
    )
    db.add(new_guest_stay)

    db.commit()
    db.refresh(new_guest_stay)
    
    return new_guest_stay


@router.get("/{guest_stay_id}", response_model = GuestStayResponse)
def get_guest_stay_by_id(
    guest_stay_id: int,
    db: Session = Depends(get_db)
):
    guest_stay = db.query(GuestStay)\
    .filter(GuestStay.id == guest_stay_id)\
    .first()

    if guest_stay is None:
        raise HTTPException(
            status_code = 404,
            detail = "Guest Stay Not Found"
        )
    
    return guest_stay


@router.put("/{guest_stay_id}", response_model = GuestStayResponse)
def update_guest_stay(
    guest_stay_id: int,
    guest_stay: GuestStayUpdate,
    db: Session = Depends(get_db)
):
    existing_guest_stay = db.query(GuestStay)\
    .filter(GuestStay.id == guest_stay_id)\
    .first()

    if existing_guest_stay is None:
        raise HTTPException(
            status_code = 404,
            detail = "Guest Stay Not Found."
        )

    update_data = guest_stay.model_dump(exclude_unset = True)

    for key, value in update_data.items():
        setattr(existing_guest_stay, key, value)

    db.commit()
    db.refresh(existing_guest_stay)

    return existing_guest_stay


@router.delete("/{guest_stay_id}")
def delete_guest_stay(
    guest_stay_id: int,
    db: Session = Depends(get_db)
):
    guest_stay = db.query(GuestStay)\
    .filter(GuestStay.id == guest_stay_id)\
    .first()

    if guest_stay == None:
        raise HTTPException(
            status_code = 404,
            detail = "Guest Stay Not Found."
        )

    db.delete(guest_stay)
    db.commit()

    return {"message": "Guest Stay Deleted Successfully"}
