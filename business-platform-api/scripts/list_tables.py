import sqlite3
import os

# Build the DB path relative to this script to avoid Windows \U unicode-escape
# issues when using backslashes in literal strings.
ROOT = os.path.dirname(os.path.dirname(__file__))
DB_PATH = os.path.join(ROOT, 'src', 'database', 'app.db')

if not os.path.exists(DB_PATH):
    print("DB file not found:", DB_PATH)
    raise SystemExit(1)

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

print("Listing tables and indexes in:", DB_PATH)
print("-" * 60)
for row in cur.execute("SELECT type, name, sql FROM sqlite_master WHERE type IN ('table','index') ORDER BY type, name;"):
    typ, name, sql = row
    print(f"{typ.upper():6} {name}")
    if sql:
        print(sql)
        print()

# also list table counts for each table
print("-" * 60)
print("Row counts:")
for row in cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"):
    tbl = row[0]
    try:
        cur2 = conn.execute(f"SELECT COUNT(*) FROM {tbl}")
        cnt = cur2.fetchone()[0]
    except Exception as e:
        cnt = f"error: {e}"
    print(f"{tbl:20} -> {cnt}")

conn.close()