from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.guest import Guest
from app.schemas.guest import GuestCreate, GuestResponse, GuestUpdate

router = APIRouter(
    prefix = "/guests",
    tags=["Guests"]
)

@router.post("", response_model = GuestResponse)
def create_guest(
    guest: GuestCreate,
    db: Session = Depends(get_db)
):
    new_guest = Guest(
        guest_name = guest.guest_name,
        guest_phone_number = guest.guest_phone_number,
        guest_address = guest.guest_address,
        id_proof_type = guest.id_proof_type,
        id_proof_number = guest.id_proof_number
    )

    db.add(new_guest)
    db.commit()
    db.refresh(new_guest)

    return new_guest

@router.get("", response_model = list[GuestResponse])
def get_guest(
    db: Session = Depends(get_db)
):
    guests = db.query(Guest).all()
    return guests

@router.get("/{guest_id}", response_model = GuestResponse)
def Get_Guest_By_Id(guest_id:int, db: Session = Depends(get_db)
):
    guest_by_id = db.query(Guest)\
    .filter(Guest.id == guest_id)\
    .first()

    if guest_by_id is None:
        raise HTTPException(
            status_code = 404,
            detail = "Guest Not Found"
        )

    return guest_by_id

@router.put("/{guest_id}", response_model = GuestResponse)
def Update_Guest_info(
    guest_id: int,
    guest: GuestUpdate,
    db: Session = Depends(get_db)
):
    existing_guest = db.query(Guest)\
    .filter(Guest.id == guest_id)\
    .first()

    if existing_guest is None:
        raise HTTPException(
            status_code=404,
            detail="Guest Not Found."
        )
    update_data = guest.model_dump(exclude_unset = True)
    
    for key, value in update_data.items():
        setattr(existing_guest, key, value)
    
    
    db.commit()
    db.refresh(existing_guest)

    return existing_guest

@router.delete("/{guest_id}")
def delete_guest(
    guest_id: int,
    db: Session = Depends(get_db)
):
    guest_info = db.query(Guest)\
    .filter(Guest.id == guest_id)\
    .first()

    if guest_info is None:
        raise HTTPException(
            status_code = 404,
            detail = "Guest not found"
        )

    db.delete(guest_info)
    db.commit()

    return {"message": "Guest Removed Successfully"}

