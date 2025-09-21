import sqlite3, json, os
DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'database', 'app.db')
DB_PATH = os.path.abspath(DB_PATH)
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()
try:
    cur.execute('SELECT id, user_id, company_name FROM suppliers')
    rows = cur.fetchall()
    suppliers = []
    for r in rows:
        suppliers.append({'id': r[0], 'user_id': r[1], 'company_name': r[2]})
    print(json.dumps({'db_path': DB_PATH, 'suppliers': suppliers}, ensure_ascii=False, indent=2))
except Exception as e:
    print(json.dumps({'error': str(e)}))
finally:
    cur.close()
    conn.close()
