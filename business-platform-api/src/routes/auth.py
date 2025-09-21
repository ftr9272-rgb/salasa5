"""Auth blueprint (minimal, clean).

Provides lightweight register, login, ping and password-reset endpoints so the
application can import and run. Implementations are intentionally small and
safe for local/dev use. Expand later for full production behavior.
"""

from datetime import datetime, timezone

from flask import Blueprint, request, jsonify, current_app

from src.models.user import db, User
from itsdangerous import URLSafeTimedSerializer
from src.utils.jwt_utils import generate_token


auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/ping', methods=['GET'])
def ping():
    return jsonify({'ok': True}), 200


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'username, email and password required'}), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'error': 'username or email already exists'}), 400

    user = User(username=username, email=email, full_name=data.get('full_name', ''), user_type=data.get('user_type', 'merchant'))
    user.set_password(password)
    user.created_at = datetime.now(timezone.utc)
    user.updated_at = datetime.now(timezone.utc)

    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'user created', 'user': user.to_dict()}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'username and password required'}), 400

    user = User.query.filter((User.username == username) | (User.email == username)).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'invalid credentials'}), 401

    # issue JWT so other routes using jwt_utils.decode_token accept it
    token = generate_token(user.id, user.user_type)

    return jsonify({'message': 'logged in', 'user': user.to_dict(), 'token': token}), 200


def _get_serializer():
    secret = current_app.config.get('SECRET_KEY', 'dev-secret')
    return URLSafeTimedSerializer(secret)


@auth_bp.route('/request-password-reset', methods=['POST'])
def request_password_reset():
    data = request.get_json() or {}
    email_or_username = data.get('email') or data.get('username')
    if not email_or_username:
        return jsonify({'error': 'email or username required'}), 400

    user = User.query.filter((User.email == email_or_username) | (User.username == email_or_username)).first()
    if not user:
        return jsonify({'message': 'If the user exists an email will be sent'}), 200

    s = _get_serializer()
    token = s.dumps({'user_id': user.id})

    allow_token_in_response = (
        bool(current_app.config.get('RETURN_RESET_TOKEN', False))
        or current_app.config.get('ENV') == 'development'
        or bool(current_app.debug)
    )

    if allow_token_in_response:
        return jsonify({'message': 'reset token (dev)', 'token': token}), 200
    return jsonify({'message': 'If the user exists an email will be sent'}), 200


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json() or {}
    token = data.get('token')
    new_password = data.get('new_password')
    if not token or not new_password:
        return jsonify({'error': 'token and new_password required'}), 400

    s = _get_serializer()
    max_age = int(current_app.config.get('PASSWORD_RESET_TOKEN_EXPIRES', 3600))
    try:
        payload = s.loads(token, max_age=max_age)
    except Exception:
        return jsonify({'error': 'invalid or expired token'}), 400

    user_id = payload.get('user_id')
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': 'user not found'}), 404

    if len(new_password) < 6:
        return jsonify({'error': 'new password must be at least 6 chars'}), 400

    user.set_password(new_password)
    user.is_active = True
    user.updated_at = datetime.now(timezone.utc)
    db.session.commit()

    return jsonify({'message': 'password reset successful'}), 200
