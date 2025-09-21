import os
import sys
ROOT = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, ROOT)
sys.path.insert(0, os.path.join(ROOT, 'src'))

from src.main import app
from src.models.supplier import db, User
import json

# Create a test user if not exists
with app.app_context():
    # enable debug so endpoints return token in responses for testing
    app.debug = True
    app.config['ENV'] = 'development'

    u = User.query.filter_by(username='test_migrated').first()
    if not u:
        u = User(username='test_migrated', email='test_migrated@example.com', full_name='Test Migrated', user_type='merchant')
        u.set_password('oldpassword')
        u.is_active = True
        db.session.add(u)
        db.session.commit()
        print('Created test user id=', u.id)
    else:
        print('Test user exists id=', u.id)

    client = app.test_client()

    # Request reset
    resp = client.post('/api/auth/request-password-reset', json={'email': 'test_migrated@example.com'})
    print('request-reset status', resp.status_code, resp.get_json())
    token = resp.get_json().get('token')

    if not token:
        print('No token returned (not running in dev/debug?). Exiting test.')
        raise SystemExit(1)

    # Reset password
    resp2 = client.post('/api/auth/reset-password', json={'token': token, 'new_password': 'new-secret-123'})
    print('reset-password status', resp2.status_code, resp2.get_json())

    # Attempt login with new password
    resp3 = client.post('/api/auth/login', json={'username': 'test_migrated', 'password': 'new-secret-123'})
    print('login status', resp3.status_code, resp3.get_json())
