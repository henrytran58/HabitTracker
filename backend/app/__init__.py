from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .config import Config
from datetime import timedelta

db = SQLAlchemy()  
def create_app():
    app = Flask(__name__)
    
    # CORS(app)
    # CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
    app.config.from_object(Config)
    app.config["JWT_SECRET_KEY"] = "super-secret"
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False
    app.config["JWT_HEADER_TYPE"] = "Bearer"
    jwt = JWTManager(app)
    CORS(app, supports_credentials=True, origins=["https://streakflow.netlify.app", "http://localhost:5173/"])
    db.init_app(app) 
    
    # Import and register blueprints
    from .routes.habit_routes import habit_bp
    from .routes.habit_log_routes import habit_log_bp
    from .routes.user_routes import user_bp
    app.register_blueprint(habit_bp)
    app.register_blueprint(habit_log_bp)
    app.register_blueprint(user_bp)

    return app