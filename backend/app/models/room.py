from decimal import Decimal

from sqlalchemy import Integer, String, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.stay import Stay

from app.database.base import Base

class Room(Base):
    __tablename__ = "rooms"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    room_number: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        unique=True
    )

    room_type: Mapped[str] = mapped_column(
        String(50),
        nullable = True
    )

    price_per_night: Mapped[Decimal] = mapped_column(
        Numeric(10,2),
        nullable = False
    )

    max_occupancy: Mapped[int] = mapped_column(
        Integer,
        nullable = True,
                
    )

    facilities: Mapped[str] = mapped_column(
        String(500),
        nullable =True
    )

    room_status: Mapped[str] = mapped_column(
        String(15),
        nullable = False
    )

    stays: Mapped[list["Stay"]] = relationship(
        back_populates="room"
    )