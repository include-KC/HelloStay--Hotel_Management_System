from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from pydantic import ConfigDict

class RoomCreate(BaseModel):
    room_number: str
    price_per_night: Decimal
    room_status: str
    room_type: Optional[str] = None
    max_occupancy: Optional[int] = None
    facilities: Optional[str] = None

class RoomResponse(BaseModel):
    id:int
    room_number: str
    price_per_night: Decimal 
    room_status: str   
    room_type: Optional[str] = None
    max_occupancy: Optional[int] = None
    facilities: Optional[str] = None

    model_config = ConfigDict(
        from_attributes=True
    )

class RoomUpdate(BaseModel):
    room_number: Optional[str] = None
    price_per_night: Optional[Decimal] = None
    room_status: Optional[str] = None
    room_type: Optional[str] = None
    max_occupancy: Optional[int] = None
    facilities: Optional[str] = None
