import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()  # Load from .env file

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = os.environ.get("SECRET_KEY", "fallback-secret")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "fallback-jwt-key")
    
# This will load your .env file and configure the database.

