from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column 
from sqlalchemy.orm import relationship

from typing import TYPE_CHECKING


from app.database.base import Base

if TYPE_CHECKING:
    from app.models.guest_stay import GuestStay

class Guest(Base):
    __tablename__ = "guests"

    id:Mapped[int] = mapped_column(
          Integer,
          primary_key = True,
          index = True
    )

    guest_name: Mapped[str] = mapped_column(
          String(30),
          nullable = False
    )

    guest_phone_number: Mapped[str] = mapped_column(
        String(20),
        nullable = False,
        unique = True
    ) 

    guest_address:Mapped[str] = mapped_column(
        String(300),
        nullable = False
    )

    id_proof_type: Mapped[str] = mapped_column(
        String(20),
        nullable = False
    )

    id_proof_number:Mapped[str] = mapped_column(
        String(20),
        nullable = False,
        unique = True
    )
    
    guest_stays: Mapped[list["GuestStay"]] = relationship(
        back_populates="guest"
    )
