from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from pydantic import ConfigDict
from datetime import datetime

class StayCreate(BaseModel):
    guest_id: int
    room_id: int
    price_per_night: Decimal
    check_in_datetime: datetime
    stay_status: str

class StayResponse(BaseModel):
    stay_id: int
    guest_id:int
    room_id:int
    price_per_night: Decimal
    check_in_datetime: datetime
    check_out_datetime: Optional[datetime]
    stay_status: str

    model_config = ConfigDict(
        from_attributes=True
    )

class StayUpdate(BaseModel):
    guest_id: Optional[int] = None
    room_id: Optional[int] = None
    price_per_night: Optional[Decimal] = None
    check_in_datetime: Optional[datetime] = None
    check_out_datetime: Optional[datetime] = None
    stay_status: Optional[str] = None

