# config.py

import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key') # Default for local development
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    REPLICATE_API_TOKEN = os.getenv('REPLICATE_API_TOKEN')
    FLASK_ENV = 'production'
    STATIC_FOLDER = '../frontend/build'
    STATIC_URL_PATH = '/'
