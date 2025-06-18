from flask import Flask
from .routes.habit_routes import habit_bp
#from .routes.user_routes import user_bp

def create_app():
    app = Flask(__name__)

    # Register blueprints
    app.register_blueprint(habit_bp)
    #app.register_blueprint(user_bp)

    return app