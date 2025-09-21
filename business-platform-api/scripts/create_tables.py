"""Run this script to (re)create all SQLAlchemy tables defined in the project.

It imports the app from `src.main` (which sets up `db`) and calls `db.create_all()`
inside the application context. Safe to run multiple times.
"""
import sys
import os

# ensure project root is on sys.path (main.py expects to find src package)
ROOT = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, ROOT)

print("Importing application (this will initialise the DB if not already)...")
try:
    import src.main as main
    from src.models.supplier import db
except Exception as e:
    print("Failed to import application:", e)
    raise

with main.app.app_context():
    print("Calling db.create_all()...")
    db.create_all()
    print("db.create_all() finished — tables created/verified.")

print("Done.")
