# routes/image.py

from flask import Blueprint, render_template, redirect, url_for, flash, request, jsonify, abort, current_app
from flask_login import login_required, current_user
from flask_jwt_extended import jwt_required, get_jwt_identity  # Import jwt_required and get_jwt_identity
from models import db, Image, User
from utils.replicate import generate_image  # Import the synchronous function
from flask_wtf import FlaskForm
from wtforms import TextAreaField, SubmitField
from wtforms.validators import DataRequired, Length
import os
from datetime import datetime
import logging


logging.basicConfig(level=logging.DEBUG)
image_bp = Blueprint('image', __name__)

class ImageForm(FlaskForm):
    prompt = TextAreaField('Enter Image Description', validators=[DataRequired(), Length(min=5, max=500)])
    style = TextAreaField('Enter Style (optional)', validators=[Length(max=100)])
    submit = SubmitField('Generate Image')

@image_bp.route('/user-images', methods=['GET'])
@jwt_required()
def get_user_images():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    images = Image.query.filter_by(user_id=current_user_id).order_by(Image.generated_at.desc()).all()
    
    return jsonify({
        "images": [{
            "id": image.id,
            "url": url_for('static', filename=image.image_path, _external=True),  # Add _external=True
            "prompt": image.prompt,
            "generated_at": image.generated_at.isoformat()
        } for image in images]
    }), 200

@image_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_image_route():
    try:
        current_user_id = get_jwt_identity()
        data = request.json

        # Generate the image
        result = generate_image(data, current_user_id)
        
        # Create new image record with the combined prompt
        new_image = Image(
            prompt=result['final_prompt'],  # Store the combined prompt string
            image_path=result['image_path'],
            user_id=current_user_id
        )
        
        db.session.add(new_image)
        db.session.commit()

        return jsonify({
            'success': True,
            'image': {
                'id': new_image.id,
                'url': url_for('static', filename=new_image.image_path, _external=True),
                'prompt': new_image.prompt,
                'generated_at': new_image.generated_at.isoformat()
            }
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@image_bp.route('/api/images/<int:image_id>', methods=['DELETE'])
@jwt_required()
def delete_image(image_id):
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        image = Image.query.get(image_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        if not image:
            logging.debug(f"Image not found for ID: {image_id}")
            return jsonify({"error": "Image not found"}), 404

        # Log the user IDs for debugging
        logging.debug(f"Current User ID: {current_user_id}, Image User ID: {image.user_id}")

           # Check if the image belongs to the current user
        if image.user_id != current_user_id:
            logging.debug("Unauthorized access attempt.")
            return jsonify({"error": "Unauthorized to delete this image"}), 403


        # Delete the actual image file
        try:
            file_path = os.path.join(current_app.static_folder, image.image_path)
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            logging.error(f"Error deleting file: {str(e)}")
            # Continue with database deletion even if file deletion fails

        # Delete from database
        db.session.delete(image)
        db.session.commit()

        return jsonify({"message": "Image deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        logging.error(f"Error in delete_image: {str(e)}")
        return jsonify({"error": "Failed to delete image"}), 500
