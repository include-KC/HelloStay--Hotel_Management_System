from pydantic import BaseModel
from typing import Optional
from pydantic import ConfigDict

class GuestStayCreate(BaseModel):
    guest_id:int
    stay_id:int
    is_primary_guest: bool = False

class GuestStayUpdate(BaseModel):
    guest_id: Optional[int] = None
    stay_id: Optional[int] = None
    is_primary_guest: Optional[bool] = None

class GuestStayResponse(BaseModel):
    id: int
    guest_id: int
    stay_id: int
    is_primary_guest: bool

    model_config = ConfigDict(from_attributes=True)


