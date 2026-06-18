from pydantic import BaseModel
from typing import Optional
from pydantic import ConfigDict

class GuestCreate(BaseModel):
    guest_name:str
    guest_phone_number:str
    guest_address:str
    id_proof_type:str
    id_proof_number:str

class GuestResponse(BaseModel):
    id:int
    guest_name:str
    guest_phone_number:str
    guest_address:str
    id_proof_type:str
    id_proof_number:str

    model_config = ConfigDict(
        from_attributes=True
    )

class GuestUpdate(BaseModel):
    guest_name:Optional[str] = None
    guest_phone_number:Optional[str] = None
    guest_address:Optional[str] = None
    id_proof_type:Optional[str] = None
    id_proof_number:Optional[str] = None       