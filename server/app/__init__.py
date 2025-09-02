from urllib import request
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Initialize extensions at module level
db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__, static_url_path='/uploads', static_folder=os.path.join(os.getcwd(), 'uploads'))

    # Load config
    from app.config import Config
    app.config.from_object(Config)

    # Enable CORS for frontend
    CORS(app,
     resources={r"/api/*": {"origins": "*"}},
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True)

    
    # Setup uploads directory
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    # Initialize extensions
    db.init_app(app)

    # create tables automatically in development
    with app.app_context():
        from app.models import User, JobSeeker, Employer, Admin, Job, Application, Resume, SavedJob, Report, Notification
        db.create_all()
        print("✅ All tables created!")


    jwt.init_app(app)

    # 🔁 Import routes only after extensions are ready
    from app.routes import main, admin_bp
    app.register_blueprint(main, url_prefix='/api')
    app.register_blueprint(admin_bp)

    @app.route("/")
    def app_root():
        return jsonify({"message": "JobHive Flask API is running! Access API routes at /api/..."})

    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        return app.send_static_file(filename)

    return app

   


# Config class
class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "fallback-secret")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "postgresql://postgres:password@localhost:5432/jobhive_db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "super-secret-jobhive-key")
