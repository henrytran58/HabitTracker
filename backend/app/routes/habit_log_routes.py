from flask import Blueprint, request, jsonify
from app.models import HabitLog, Habit
from app import db
from datetime import date
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from collections import defaultdict

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

    print("before isoformat:", completed_date)
    if habit_id is None or status is None:
        return jsonify({"message": "habit_id and status are required"}), 400
    
    try:
        completed_date = date.fromisoformat(completed_date)
        print("afeter isoformat:", completed_date)
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
# @habit_log_bp.route("/api/habit_logs/summary", methods=["GET"])
# @jwt_required()
# def get_log_summary():
#     user_id = get_jwt_identity()
@habit_log_bp.route("/api/habit_logs/summary", methods=["GET"])
def get_log_summary():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400
    # Fetch all True status logs for user's habits
    logs = db.session.query(
        Habit.id.label("habit_id"),
        Habit.name.label("habit_name"),
        Habit.current_streak,
        Habit.longest_streak,
        Habit.start_date.label("started_date"),
        Habit.count,
        HabitLog.completed_date
    ).join(Habit).filter(
        Habit.user_id == user_id,
        HabitLog.status == True
    ).order_by(HabitLog.completed_date).all()
    # Group logs by habit
    grouped = defaultdict(lambda: {
        "logs": [],
        "habit_id": None,
        "habit_name": "",
        "current_streak": 0,
        "longest_streak": 0,
        "started_date": None,
        "total_count": 0
    })

    for habit_id, habit_name, current_streak, longest_streak, started_date, total_count, completed_date in logs:
        habit_data = grouped[habit_id]
        habit_data["habit_id"] = habit_id
        habit_data["habit_name"] = habit_name
        habit_data["current_streak"] = current_streak
        habit_data["longest_streak"] = longest_streak
        habit_data["started_date"] = started_date.isoformat() if started_date else None
        habit_data["total_count"] = total_count
        habit_data["logs"].append({
            "date": completed_date.isoformat(),
            "count": 1
        })

    # Add completion rate
    today = date.today()
    for habit in grouped.values():
        if habit["started_date"]:
            start_date = date.fromisoformat(habit["started_date"])
            days_active = (today - start_date).days + 1
            habit["completion_rate"] = round(habit["total_count"] / days_active, 2) if days_active > 0 else 0.0
        else:
            habit["completion_rate"] = 0.0

    return jsonify({ "summary": list(grouped.values()) })
# @habit_log_bp.route("/api/habit_logs/summary", methods=["GET"])
# @jwt_required()
# def get_log_summary():
#     user_id = get_jwt_identity()

#     # Join Habit and HabitLog, filter by user_id and completed status
#     logs = db.session.query(
#         Habit.id.label("habit_id"),
#         Habit.name.label("habit_name"),
#         HabitLog.completed_date,
#         db.func.count(HabitLog.id).label("count")
#     ).join(Habit).filter(
#         Habit.user_id == user_id,
#         HabitLog.status == True
#     ).group_by(
#         Habit.id, Habit.name, HabitLog.completed_date
#     ).all()

#     # Group logs by habit_id
#     grouped = {}
#     for habit_id, habit_name, date, count in logs:
#         if habit_id not in grouped:
#             grouped[habit_id] = {
#                 "habit_id": habit_id,
#                 "habit_name": habit_name,
#                 "logs": []
#             }
#         grouped[habit_id]["logs"].append({
#             "date": date.isoformat(),
#             "count": count
#         })

#     return jsonify({"summary": list(grouped.values())})

# @habit_log_bp.route("/api/habit_logs/summary", methods=["GET"])
# @jwt_required()
# def get_log_summary():
#     user_id = get_jwt_identity()

#     logs = db.session.query(HabitLog.completed_date, db.func.count(HabitLog.id))\
#         .join(Habit)\
#         .filter(Habit.user_id == user_id, HabitLog.status == True)\
#         .group_by(HabitLog.completed_date)\
#         .all()

#     result = [{"date": date.isoformat(), "count": count} for date, count in logs]
#     return jsonify({"summary": result})

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