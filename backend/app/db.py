import os
import sqlite3
from contextlib import contextmanager

DB_PATH = os.getenv("DATABASE_PATH", os.path.join(os.getcwd(), "app.db"))


def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON")
    try:
        yield conn
    finally:
        conn.close()


@contextmanager
def get_db_context():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON")
    try:
        yield conn
    finally:
        conn.close()


def init_db():
    with get_db_context() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS investors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                investor_type TEXT,
                country TEXT,
                date_added TEXT,
                last_updated TEXT
            );

            CREATE TABLE IF NOT EXISTS commitments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                investor_id INTEGER NOT NULL,
                asset_class TEXT,
                amount INTEGER NOT NULL DEFAULT 0,
                currency TEXT,
                FOREIGN KEY(investor_id) REFERENCES investors(id) ON DELETE CASCADE
            );
            """
        )
        conn.commit() 