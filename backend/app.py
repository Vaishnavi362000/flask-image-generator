from flask import Flask, send_from_directory
from config import Config
from models import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_login import LoginManager
from routes.auth import auth_bp
from routes.sample import sample_bp
from routes.image import image_bp
from flask_cors import CORS
import os

def create_app():
    app = Flask(__name__, static_folder='../frontend/build/static', static_url_path='/static')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'default_key_for_dev')
    app.config.from_object(Config)
    #app.config['DEBUG'] = True

    #static_app = Flask('static_app', static_folder='static', static_url_path='/static')
    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app) 
    login_manager = LoginManager()
    login_manager.init_app(app)
    migrate = Migrate(app, db)

    # Serve static files (images)
    @app.route('/static/<path:filename>')
    def serve_static(filename):
        return send_from_directory('static', filename)
    
    # Serve React app
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path.startswith('auth/') or path.startswith('api/') or path.startswith('image/'):
            return app.send_static_file('index.html')
        if path != "" and os.path.exists(os.path.join('../frontend/build', path)):
            return send_from_directory('../frontend/build', path)
        return send_from_directory('../frontend/build', 'index.html')

    # Update the CORS configuration
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000", "https://flask-image-generator-e6y7.onrender.com"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
            "expose_headers": ["Content-Range", "X-Content-Range"]
        }
    })

    # Set additional headers for all responses
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(sample_bp, url_prefix='/api')
    app.register_blueprint(image_bp, url_prefix='/image')

    # Import User model for login manager
    from models import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    return app

app = create_app()

if __name__ == '__main__': 
    app.run(debug=False)
