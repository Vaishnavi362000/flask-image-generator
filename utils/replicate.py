# utils/replicate.py

import os
import replicate
import requests
from flask import current_app
from datetime import datetime

def generate_image(prompt_data, user_id):
    """Generate image using Replicate API and save it locally"""
    try:
        # Construct the prompt based on the input type
        if isinstance(prompt_data, dict):
            if 'customPrompt' in prompt_data:
                # Custom prompt
                final_prompt = prompt_data['customPrompt']
            else:
                # Guided prompt - combine all parameters into one prompt
                style = prompt_data.get('style', '')
                subject = prompt_data.get('subject', '')
                mood = prompt_data.get('mood', '')
                lighting = prompt_data.get('lighting', '')
                final_prompt = f"{subject} in {style} style with {mood} mood and {lighting} lighting"
        else:
            final_prompt = str(prompt_data)

        # Run the model
        output = replicate.run(
            "black-forest-labs/flux-schnell",
            input={
                "prompt": final_prompt,
            }
        )
        
        # Get the image URL from the output
        if output and isinstance(output, list) and len(output) > 0:
            image_url = output[0]
            
            # Create directory if it doesn't exist
            os.makedirs('static/images', exist_ok=True)
            
            # Generate unique filename
            filename = f"user_{user_id}_{datetime.now().strftime('%Y%m%d%H%M%S%f')}.png"
            image_path = os.path.join('static/images', filename)
            
            # Download and save the image
            response = requests.get(image_url)
            if response.status_code == 200:
                with open(image_path, 'wb') as f:
                    f.write(response.content)
                
                return {
                    'image_path': f"images/{filename}",
                    'final_prompt': final_prompt
                }
            else:
                raise Exception(f"Failed to download image: {response.status_code}")
        else:
            raise Exception("No image generated from API")
            
    except Exception as e:
        raise Exception(f"Image generation failed: {str(e)}")
