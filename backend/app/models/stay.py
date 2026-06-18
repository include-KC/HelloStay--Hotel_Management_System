from sqlalchemy import Integer, String, Numeric, DateTime, ForeignKey
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column

from app.models.room import Room
from app.models.guest import Guest

from app.database.base import Base

class Stay(Base):
    __tablename__ = "stays"

    stay_id:Mapped[int] = mapped_column(
        Integer,
        primary_key = True
    )

    guest_id:Mapped[int] = mapped_column(
        Integer,
        ForeignKey("guests.id"),           
        nullable = False,
    )

    room_id:Mapped[int] = mapped_column(
        Integer, 
        ForeignKey("rooms.id"),
        unique = False,
        nullable = False,
    )

    price_per_night:Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable = False
    )

    check_in_datetime:Mapped[DateTime] = mapped_column(
        DateTime,
        nullable = False
    )

    check_out_datetime:Mapped[DateTime] = mapped_column(
        DateTime,
        nullable = True
    )

    stay_status:Mapped[str] = mapped_column(
        String(20),
        nullable = False
    )





