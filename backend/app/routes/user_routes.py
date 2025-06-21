from flask import Blueprint, request, jsonify
from app.models import User
from flask_jwt_extended import create_access_token
from app import db

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    user = User.query.filter_by(username=username).first()
    access_token = create_access_token(identity=user.id)  # generate token

    if user and user.check_password(password):
        return jsonify({"token":access_token, "user": user.to_json()}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401
    
@user_bp.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    name = data.get('name')

    if not username or not password or not email:
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"error": "Username or email already exists"}), 400

    new_user = User(username=username, email=email, name=name)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered", "user": new_user.to_json()}), 201

