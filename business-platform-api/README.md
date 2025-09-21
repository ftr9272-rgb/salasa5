# business-platform-api (Development notes)

This README summarizes how to run the backend locally and run the purchase-order integration test included in the repository.

Requirements
- Python 3.10+ (project tested with 3.11)
- A virtual environment (recommended)

Quick start (PowerShell)

```powershell
Set-Location -Path "C:\path\to\your\repo\business-platform-api"
# create venv (if not present)
python -m venv .venv
. .\.venv\Scripts\Activate
pip install -r requirements.txt
# Run the app (development)
.\.venv\Scripts\python.exe src\main.py
# Run the integration test
.\.venv\Scripts\python.exe -m pytest tests/test_purchase_order_flow.py -q
```

Password reset token behavior
- For development and CI convenience, the backend may include the password-reset `token` in the JSON response from `/api/auth/request-password-reset` when ONE of the following is true:
  - `current_app.debug` is true
  - `ENV` config is `development`
  - explicit config value `RETURN_RESET_TOKEN=True`

Make sure `RETURN_RESET_TOKEN` is `False` or unset in production to avoid leaking reset tokens in responses.

Notes
- The project uses SQLAlchemy and a local SQLite DB located at `src/database/app.db` by default.
- Some deprecation warnings related to naive datetimes and Query.get() have been addressed; more cleanup may be beneficial for production hardening.
