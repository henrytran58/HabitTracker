from flask import Blueprint, request, jsonify
from app.models import Habit
from app import db
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from datetime import date

habit_bp = Blueprint('habit_bp', __name__)

@habit_bp.route('/api/habits', methods=['GET'])
@jwt_required()
def get_habits():
    print("Headers:", request.headers)
    print("Method:", request.method)
    # user_id = request.args.get("user_id")
    user_id = get_jwt_identity()
    print(user_id)
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    habits = Habit.query.filter_by(user_id=user_id).all()
    json_habits = [habit.to_json() for habit in habits]

    return jsonify({"habits": json_habits})

@habit_bp.route('/api/create_habit', methods=["POST"])
def create_habit():
    data = request.get_json()
    user_id = data['user_id']
    name = data['name']
    frequency = data.get('frequency', 'daily')  # default to 'daily' if not provided
    start_date = data.get('start_date', date.today())  # default to today
    if not user_id or not name:
        return (jsonify({"message":"You must include user ID and name"})), 400
    new_habit = Habit(
            user_id=user_id,
            name=name,
            frequency=frequency,
            start_date=start_date,
            current_streak=0,
            longest_streak=0,
            count=0
        )
    try:
        


        db.session.add(new_habit)
        db.session.commit()

        return jsonify({
            'message': 'Habit created successfully!',
            'habit': new_habit.to_json()
        }), 201

    except KeyError as e:
        return jsonify({'error': f'Missing required field: {str(e)}'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@habit_bp.route('/api/update_habit/<int:habit_id>', methods=['PATCH'])
def update_habit(habit_id):
    data = request.get_json()
    habit = Habit.query.get(habit_id)

    if not habit:
        return jsonify({'error': 'Habit not found'}), 404

    # Update only the fields that are provided
    habit.name = data.get('name', habit.name)
    habit.frequency = data.get('frequency', habit.frequency)
    habit.start_date = data.get('start_date', habit.start_date)
    habit.current_streak = data.get('current_streak', habit.current_streak)
    habit.longest_streak = data.get('longest_streak', habit.longest_streak)
    habit.count = data.get('count', habit.count)

    try:
        db.session.commit()
        return jsonify({'message': 'Habit updated successfully!', 'habit': habit.to_json()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    

@habit_bp.route('/api/delete_habit/<int:habit_id>', methods=['DELETE'])
def delete_habit(habit_id):
    habit = Habit.query.get(habit_id)

    if not habit:
        return jsonify({'error': 'Habit not found'}), 404

    try:
        db.session.delete(habit)
        db.session.commit()
        return jsonify({'message': 'Habit deleted successfully!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500