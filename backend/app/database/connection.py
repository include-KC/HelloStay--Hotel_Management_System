from sqlalchemy import create_engine

import sqlite3

from sqlalchemy import event
from sqlalchemy.engine import Engine

DATABASE_URL = "sqlite:///hellostay.db"

engine = create_engine(
    DATABASE_URL,
    echo=True
)

@event.listens_for(Engine, "connect")
def enable_sqlite_foreign_keys(dbapi_connection, connection_record):
    if isinstance(dbapi_connection, sqlite3.Connection):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()