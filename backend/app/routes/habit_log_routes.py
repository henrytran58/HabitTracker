from flask import Blueprint, request, jsonify
from app.models import HabitLog
from app import db
from datetime import date

habit_log_bp = Blueprint('habit_log_bp', __name__)

# @habit_log_bp.route('/api/habit_logs', methods=['GET'])
# def get_habits():
#     habits = HabitLog.query.all()
#     json_habits = list(map(lambda x:x.to_json(), habits))
#     return jsonify({"habits": json_habits})

@habit_log_bp.route('/api/habit_logs', methods=['GET'])
def get_habit_logs_by_date():
    date_str = request.args.get('date')
    if not date_str:
        return jsonify({'error': 'Date is required'}), 400

    try:
        target_date = date.fromisoformat(date_str)
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

    logs = HabitLog.query.filter_by(completed_date=target_date).all()
    return jsonify({'habit_logs': [log.to_json() for log in logs]})
@habit_log_bp.route('/api/create_habit_log', methods=["POST"])
def create_or_update_habit_log():
    data = request.get_json()
    habit_id = data.get('habit_id')
    completed_date = data.get('completed') or date.today().isoformat()
    status = data.get('status')

    if habit_id is None or status is None:
        return jsonify({"message": "habit_id and status are required"}), 400

    try:
        completed_date = date.fromisoformat(completed_date)
    except ValueError:
        return jsonify({'message': 'Invalid completed date format'}), 400

    try:
        # Check if log already exists for that habit on that date
        habit_log = HabitLog.query.filter_by(habit_id=habit_id, completed_date=completed_date).first()

        if habit_log:
            # Update existing log
            habit_log.status = status
        else:
            # Create new log
            habit_log = HabitLog(
                habit_id=habit_id,
                completed_date=completed_date,
                status=status
            )
            db.session.add(habit_log)

        db.session.commit()

        return jsonify({
            'message': 'Habit log saved successfully!',
            'habit_log': habit_log.to_json()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# @habit_log_bp.route('/api/update_habit_log/<int:id>', methods=['PATCH'])
# def update_habit_log(id):
#     habit_log = HabitLog.query.get(id)
#     if not habit_log:
#         return jsonify({'message': 'Habit log not found'}), 404

#     data = request.get_json()
#     habit_log.status = data.get('status', habit_log.status)
#     habit_log.completed_date = data.get('completed_date', habit_log.completed_date)

#     try:
#         db.session.commit()
#         return jsonify({'message': 'Habit log updated', 'habit_log': habit_log.to_json()})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
    

# @habit_log_bp.route('/api/delete_habit_log/<int:id>', methods=['DELETE'])
# def delete_habit_log(id):
#     habit_log = HabitLog.query.get(id)
#     if not habit_log:
#         return jsonify({'message': 'Habit log not found'}), 404

#     try:
#         db.session.delete(habit_log)
#         db.session.commit()
#         return jsonify({'message': 'Habit log deleted'})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500