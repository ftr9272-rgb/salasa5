"""Compatibility shim: re-export the single SQLAlchemy `db` and `User` model
defined in `src.models.supplier` so other modules importing
`src.models.user` continue to work without creating a second
SQLAlchemy instance.
"""

from src.models.supplier import db, User

__all__ = ["db", "User"]
