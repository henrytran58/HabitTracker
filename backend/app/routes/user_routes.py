from flask import Blueprint, request, jsonify
from app.models import User
from app import db

user_bp = Blueprint('user_bp', __name__)

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

@user_bp.route("/api/login", methods=["OPTIONS"])
def login_options():
    response = jsonify({})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    return response
@user_bp.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        return jsonify({"message": "Login successful", "user": user.to_json()})
    else:
        return jsonify({"error": "Invalid credentials"}), 401
    