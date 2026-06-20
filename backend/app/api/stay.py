from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.models.guest import Guest
from app.models.room import Room
from app.models.stay import Stay

from app.database.session import get_db
from app.schemas.stay import StayCreate, StayResponse, StayUpdate

router = APIRouter(
    prefix = "/stay",
    tags = ["Stays"]
)

@router.post("", response_model = StayResponse)
def Create_Stay(
    stay:StayCreate,
    db: Session = Depends(get_db)
):

    room = db.query(Room)\
    .filter(Room.id == stay.room_id)\
    .first()

    if room is None:
        raise HTTPException(
            status_code=404,
            detail="Room not found"
        )
    
    new_stay = Stay(
        room_id = stay.room_id,
        price_per_night = stay.price_per_night,
        check_in_datetime = stay.check_in_datetime,
        stay_status = stay.stay_status
    )

    db.add(new_stay)
    db.commit()
    db.refresh(new_stay)

    return new_stay

@router.get("", response_model = list[StayResponse])
def get_stay(
    db: Session = Depends(get_db)
):
    
    stay_data = db.query(Stay).all()
    return stay_data

@router.get("/{stay_id}", response_model = StayResponse)
def Get_Stay_by_Id(
    stay_id: int,
    db: Session = Depends(get_db)
):
    
    stay_data = db.query(Stay)\
    .filter(Stay.stay_id == stay_id)\
    .first()

    if stay_data is None:
        raise HTTPException(
            status_code = 404,
            detail = "Record not found."
        )
    
    return stay_data

@router.put("/{stay_id}", response_model = StayResponse)
def Update_Stay_by_Id(
    stay_id: int, 
    stay: StayUpdate,
    db: Session = Depends(get_db)
):

    existing_stay = db.query(Stay)\
    .filter(Stay.stay_id == stay_id)\
    .first()

    if existing_stay is None:
        raise HTTPException(
            status_code = 404,
            detail = "Record not found."
        )
    
    update_data = stay.model_dump(exclude_unset = True)

    for key, value in update_data.items():
        setattr(existing_stay, key, value)    

    db.commit()
    db.refresh(existing_stay)

    return existing_stay

@router.delete("/{stay_id}")
def Delete_Stay_by_Id(stay_id: int, db: Session = Depends(get_db)):
    stay_data = db.query(Stay)\
    .filter(Stay.stay_id == stay_id)\
    .first()

    if stay_data is None:
        raise HTTPException(
            status_code = 404,
            detail = "Record not found."
        )
    
    db.delete(stay_data)
    db.commit()

    return "Record deleted successfully"