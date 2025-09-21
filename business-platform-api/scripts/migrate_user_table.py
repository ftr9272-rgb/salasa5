"""Migrate records from legacy `user` table into `users` table.

Behavior and safety decisions:
- Creates a backup copy of the SQLite DB before making changes.
- Copies rows from `user` (legacy) into `users` only if `username` or `email` do not already exist in `users`.
- For migrated rows: sets `full_name` to username, `password_hash` to a random placeholder hash, `user_type` to 'merchant' (fallback) and `is_active` to False so migrated users cannot login until they reset password.
- Prints a short report of rows inspected, skipped (duplicates), and inserted.

Run with: `py -3 migrate_user_table.py` from this scripts folder or with full path.
"""
import sqlite3
import os
import shutil
import hashlib
import random
import string

ROOT = os.path.dirname(os.path.dirname(__file__))
DB_PATH = os.path.join(ROOT, 'src', 'database', 'app.db')
BACKUP_PATH = DB_PATH + '.backup'

if not os.path.exists(DB_PATH):
    print('DB not found at', DB_PATH)
    raise SystemExit(1)

print('Backing up DB to', BACKUP_PATH)
shutil.copy2(DB_PATH, BACKUP_PATH)

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# Read legacy rows
cur.execute("SELECT id, username, email FROM user")
legacy = cur.fetchall()
print(f'Found {len(legacy)} rows in legacy `user` table')

inserted = 0
skipped = 0

for lid, username, email in legacy:
    # check duplicates in users
    cur.execute("SELECT id FROM users WHERE username=? OR email=?", (username, email))
    if cur.fetchone():
        skipped += 1
        continue

    # generate a placeholder password hash (random salt); developer should require reset
    random_pw = ''.join(random.choices(string.ascii_letters + string.digits, k=20))
    pw_hash = hashlib.sha256(random_pw.encode('utf-8')).hexdigest()

    # Insert with minimal required fields for `users` table: username, email, password_hash, full_name
    cur.execute(
        "INSERT INTO users (username, email, password_hash, full_name, phone, user_type, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
        (username, email, pw_hash, username, None, 'merchant', 0)
    )
    inserted += 1

conn.commit()
conn.close()

print(f'Inserted: {inserted}, Skipped (duplicates): {skipped}')
print('Backup is at', BACKUP_PATH)
print('NOTE: Migrated accounts are marked inactive and assigned placeholder password hashes. Implement a reset flow to enable them.')
