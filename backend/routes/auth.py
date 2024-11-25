from flask import Blueprint, jsonify, request
from models import db, User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import requests
import os

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/google-login', methods=['POST'])
def google_login():
    # Retrieve the CLIENT_ID from the environment
    CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    
    if not CLIENT_ID:
        return jsonify({"error": "Server misconfiguration: Missing CLIENT_ID"}), 500

    # Extract the access token from the request
    data = request.get_json()
    token = data.get('token')

    if not token:
        return jsonify({"error": "Missing token in request"}), 400

    try:
        # Use the access token to fetch user info from Google's userinfo endpoint
        userinfo_response = requests.get(
            f'https://www.googleapis.com/oauth2/v3/userinfo?access_token={token}'
        )

        if userinfo_response.status_code != 200:
            return jsonify({"error": "Failed to fetch user info from Google"}), 401

        user_info = userinfo_response.json()
        email = user_info.get('email')

        if not email:
            raise ValueError("Token verification failed: No email in user info")

        # Check if the user exists in the database
        user = User.query.filter_by(email=email).first()
        if not user:
            # If the user doesn't exist, create one
            user = User(email=email)
            db.session.add(user)
            db.session.commit()

        # Generate a JWT token for the user
        access_token = create_access_token(identity=str(user.id), additional_claims={"email": email})

        return jsonify({
            "success": True,
            "token": access_token,
            "user": {
                "id": user.id,
                "username": user.username,  # Adjust based on your User model
                "email": user.email
            }
        }), 200

    except ValueError as e:
        # Handle ValueError (e.g., missing email in user info)
        return jsonify({"error": "Invalid Google token", "details": str(e)}), 401
    except Exception as e:
        # Handle any unexpected errors
        return jsonify({"error": "Internal server error", "details": str(e)}), 500




@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not all(k in data for k in ["username", "email", "password"]):
        return jsonify({"error": "Missing required fields"}), 400
    
    existing_user = User.query.filter(
        (User.username == data['username']) | (User.email == data['email'])
    ).first()
    
    if existing_user:
        return jsonify({"error": "Username or email already exists"}), 409

    new_user = User(
        username=data['username'],
        email=data['email']
    )
    new_user.set_password(data['password'])
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Registration successful"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not all(k in data for k in ["email", "password"]):
        return jsonify({"error": "Missing required fields"}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=str(user.id), additional_claims={"sub": str(user.id)})
        return jsonify({
            "success": True,
            "token": access_token,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }), 200
    
    return jsonify({"error": "Invalid email or password"}), 401

@auth_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    current_user = get_jwt_identity()
    print("Current User ID:", current_user)  # Log the current user ID

    user = User.query.get(current_user)
    if user is None:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }), 200

@auth_bp.route('/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
            
        return jsonify({
            'success': True,
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 401
