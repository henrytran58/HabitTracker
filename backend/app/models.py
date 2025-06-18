from config import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  # hashed password
    email = db.Column(db.String(100), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=True)

    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "name": self.name
        }


class Habit(db.Model):
    __tablename__ = 'habits'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    frequency = db.Column(db.String(50), nullable=False, default='daily')
    start_date = db.Column(db.Date, nullable=False)
    current_streak = db.Column(db.Integer, default=0)
    longest_streak = db.Column(db.Integer, default=0)
    count = db.Column(db.Integer, default=0)

    # relationship to user (optional, helpful)
    user = db.relationship('User', backref=db.backref('habits', cascade='all, delete'))

    def to_json(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "frequency": self.frequency,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "current_streak": self.current_streak,
            "longest_streak": self.longest_streak,
            "count": self.count
        }


class HabitLog(db.Model):
    __tablename__ = 'habit_logs'

    id = db.Column(db.Integer, primary_key=True)
    habit_id = db.Column(db.Integer, db.ForeignKey('habits.id', ondelete='CASCADE'), nullable=False)
    completed_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.Boolean, nullable=False)  # True = completed, False = missed

    # relationship to habit (optional)
    habit = db.relationship('Habit', backref=db.backref('logs', cascade='all, delete'))

    def to_json(self):
        return {
            "id": self.id,
            "habit_id": self.habit_id,
            "completed_date": self.completed_date.isoformat() if self.completed_date else None,
            "status": self.status
        }
