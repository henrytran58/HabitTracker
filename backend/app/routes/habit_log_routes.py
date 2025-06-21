from flask import Blueprint, request, jsonify
from app.models import HabitLog, Habit
from app import db
from datetime import date

habit_log_bp = Blueprint('habit_log_bp', __name__)

# @habit_log_bp.route('/api/habit_logs', methods=['GET'])
# def get_habits():
#     habits = HabitLog.query.all()
#     json_habits = list(map(lambda x:x.to_json(), habits))
#     return jsonify({"habits": json_habits})

from datetime import datetime, timedelta

def update_streaks(habit_id):
    try:
        habit = Habit.query.get(habit_id)
        if not habit:
            print(f"[update_streaks] No habit found for ID {habit_id}")
            return

        logs = HabitLog.query.filter_by(habit_id=habit_id, status=True)\
                             .order_by(HabitLog.completed_date.desc())\
                             .all()

        total_completed = len(logs)

        current_streak = 1 if logs else 0
        for i in range(1, len(logs)):
            delta = (logs[i - 1].completed_date - logs[i].completed_date).days
            if delta == 1:
                current_streak += 1
            else:
                break

        longest_streak = 1 if logs else 0
        streak = 1
        for i in range(1, len(logs)):
            delta = (logs[i - 1].completed_date - logs[i].completed_date).days
            if delta == 1:
                streak += 1
                longest_streak = max(longest_streak, streak)
            else:
                streak = 1

        habit.count = total_completed
        habit.current_streak = current_streak
        habit.longest_streak = longest_streak
        db.session.commit()

        print(f"[update_streaks] Updated habit {habit_id}: total={total_completed}, current={current_streak}, longest={longest_streak}")

    except Exception as e:
        print(f"[update_streaks] ERROR: {str(e)}")
def calculate_longest_streak(logs):
    if not logs:
        return 0

    longest = 0
    streak = 1

    for i in range(1, len(logs)):
        delta = (logs[i - 1].completed_date - logs[i].completed_date).days
        if delta == 1:
            streak += 1
        else:
            longest = max(longest, streak)
            streak = 1

    return max(longest, streak)


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
        update_streaks(habit_id)
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