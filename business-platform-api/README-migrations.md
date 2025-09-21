# Database migrations (Alembic)

This project uses Alembic to manage database schema migrations for the Flask+SQLAlchemy backend.

Quick start (local development)

1. Install dependencies (ensure `alembic` is installed). From project root:

```powershell
Push-Location "c:\Users\ffwfj\OneDrive\سطح المكتب\salasa5\business-platform-api"
py -3 -m pip install -r requirements.txt
Pop-Location
```

2. Alembic is configured to read the SQLALCHEMY_DATABASE_URI from the Flask app (`src.main`). To see current migration state:

```powershell
Push-Location "c:\Users\ffwfj\OneDrive\سطح المكتب\salasa5\business-platform-api"
py -3 -m alembic -c "alembic.ini" current
py -3 -m alembic -c "alembic.ini" history --verbose
Pop-Location
```

3. After changing models, create a migration and apply it:

```powershell
Push-Location "c:\Users\ffwfj\OneDrive\سطح المكتب\salasa5\business-platform-api"
py -3 -m alembic -c "alembic.ini" revision --autogenerate -m "describe changes"
py -3 -m alembic -c "alembic.ini" upgrade head
Pop-Location
```

Notes
- An initial baseline migration has been created and the DB was stamped to that revision. Future migrations will be generated relative to that baseline.
- For production, consider using a proper migration workflow in CI/CD and backups before applying migrations.
