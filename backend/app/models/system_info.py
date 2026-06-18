from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class SystemInfo(Base):
    __tablename__ = "system_info"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    application_name: Mapped[str] = mapped_column(
        String(100)
    )

    version: Mapped[str] = mapped_column(
        String(20)
    )