import jwt
from datetime import datetime, timedelta, timezone
from flask import current_app

def generate_token(user_id, user_type, expires_minutes=60*24):
    """Generate JWT token with user id and type"""
    now = datetime.now(timezone.utc)
    payload = {
        'sub': user_id,
        'type': user_type,
        'iat': now,
        'exp': now + timedelta(minutes=expires_minutes)
    }
    secret = current_app.config.get('SECRET_KEY')
    token = jwt.encode(payload, secret, algorithm='HS256')
    return token


def decode_token(token):
    secret = current_app.config.get('SECRET_KEY')
    try:
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        return payload
    except Exception:
        return None
