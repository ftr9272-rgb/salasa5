from flask import Blueprint, jsonify, request
from src.models.supplier import User, db

user_bp = Blueprint('user', __name__)

@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.json
    user = User(
        username=data['username'], 
        email=data['email'],
        full_name=data.get('full_name', ''),
        phone=data.get('phone', ''),
        user_type=data.get('user_type', 'merchant')
    )
    if 'password' in data:
        user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    user.full_name = data.get('full_name', user.full_name)
    user.phone = data.get('phone', user.phone)
    user.user_type = data.get('user_type', user.user_type)
    if 'password' in data:
        user.set_password(data['password'])
    db.session.commit()
    return jsonify(user.to_dict())

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204
