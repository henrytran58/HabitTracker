from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .config import Config

db = SQLAlchemy()  
def create_app():
    app = Flask(__name__)
    CORS(app)
    
    app.config.from_object(Config)
    db.init_app(app) 

    # Import and register blueprints
    from .routes.habit_routes import habit_bp
    from .routes.habit_log_routes import habit_log_bp
    from .routes.user_routes import user_bp
    app.register_blueprint(habit_bp)
    app.register_blueprint(habit_log_bp)
    app.register_blueprint(user_bp)

    return app