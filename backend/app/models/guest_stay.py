from sqlalchemy import Boolean, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

from app.models.guest import Guest
from app.models.stay import Stay

class GuestStay(Base):
    __tablename__ = "guest_stays"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    guest_id: Mapped[int] = mapped_column(
        ForeignKey("guests.id", ondelete="CASCADE"),
        nullable=False
    )

    stay_id: Mapped[int] = mapped_column(
        ForeignKey("stays.stay_id", ondelete="CASCADE"),
        nullable=False
    )

    is_primary_guest: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False
    )

    guest: Mapped["Guest"] = relationship(
        back_populates="guest_stays"
    )

    stay: Mapped["Stay"] = relationship(
        back_populates="guest_stays"
    )