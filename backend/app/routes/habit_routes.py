from flask import Blueprint, request, jsonify

habit_bp = Blueprint('habit_bp', __name__)

@habit_bp.route('/main', methods=['GET'])
def get_habits():
    return jsonify({"message": "List of habits"})