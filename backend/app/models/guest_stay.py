from sqlalchemy import Boolean, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import UniqueConstraint


from app.database.base import Base

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.guest import Guest
    from app.models.stay import Stay

class GuestStay(Base):
    __tablename__ = "guest_stays"

    table_args__ = (
        UniqueConstraint(
            "guest_id",
            "stay_id",
            name="uq_guest_stay",
        ),
    )


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