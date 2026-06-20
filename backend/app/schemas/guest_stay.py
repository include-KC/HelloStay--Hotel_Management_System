from pydantic import BaseModel
from typing import Optional
from pydantic import ConfigDict

class GuestStayCreate(BaseModel):
    guest_id:int
    stay_id:int
    is_primary_guest: bool = False

class GuestStayResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    guest_id: int
    stay_id: int
    is_primary_guest: bool


