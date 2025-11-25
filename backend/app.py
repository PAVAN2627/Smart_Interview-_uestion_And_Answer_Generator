import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import AzureOpenAI
from dotenv import load_dotenv

# Load environment variables from .env.local or .env file
# Look in parent directory (project root) for .env files
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.local'))
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

app = Flask(__name__, static_folder="../", static_url_path="")
CORS(app)

# Configure Azure OpenAI with environment variables
azure_endpoint = os.getenv('AZURE_OPENAI_ENDPOINT')
azure_key = os.getenv('AZURE_OPENAI_KEY')
azure_deployment = os.getenv('AZURE_OPENAI_DEPLOYMENT')
azure_api_version = os.getenv('AZURE_OPENAI_API_VERSION')

if not all([azure_endpoint, azure_key, azure_deployment, azure_api_version]):
    print("WARNING: Azure OpenAI environment variables not fully set!")
    print("Required: AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_KEY, AZURE_OPENAI_DEPLOYMENT, AZURE_OPENAI_API_VERSION")
else:
    client = AzureOpenAI(
        azure_endpoint=azure_endpoint,
        api_key=azure_key,
        api_version=azure_api_version
    )

@app.route("/")
def home():
    return app.send_static_file("index.html")

@app.route('/generate', methods=['POST'])
def generate_qa():
    try:
        # Check if Azure OpenAI is configured
        if not all([azure_endpoint, azure_key, azure_deployment, azure_api_version]):
            return jsonify({
                'error': 'Azure OpenAI not configured. Please set all required environment variables.'
            }), 500

        data = request.get_json()
        role = data.get('role', '').strip()
        
        if not role:
            return jsonify({'error': 'Role is required'}), 400

        # Generate technical questions
        technical_prompt = f"""Generate exactly 10 technical interview questions with detailed answers for a {role} position.

Return the response as a valid JSON array with this exact format:
[
  {{"question": "question text here", "answer": "detailed answer here"}},
  ...
]

Make the questions challenging and relevant to the role. Provide comprehensive answers."""

        technical_response = client.chat.completions.create(
            model=azure_deployment,
            messages=[
                {"role": "system", "content": "You are an expert technical interviewer. Always respond with valid JSON only."},
                {"role": "user", "content": technical_prompt}
            ],
            temperature=0.7
        )
        
        technical_text = technical_response.choices[0].message.content.strip()
        
        # Clean up the response to extract JSON
        if '```json' in technical_text:
            technical_text = technical_text.split('```json')[1].split('```')[0].strip()
        elif '```' in technical_text:
            technical_text = technical_text.split('```')[1].split('```')[0].strip()
        
        technical_qa = json.loads(technical_text)
        
        # Generate personal questions
        personal_prompt = f"""Generate exactly 5 personal/behavioral interview questions with detailed answers for a {role} position.

Return the response as a valid JSON array with this exact format:
[
  {{"question": "question text here", "answer": "detailed answer here"}},
  ...
]

Focus on soft skills, teamwork, problem-solving, and career goals. Provide thoughtful sample answers."""

        personal_response = client.chat.completions.create(
            model=azure_deployment,
            messages=[
                {"role": "system", "content": "You are an expert HR interviewer. Always respond with valid JSON only."},
                {"role": "user", "content": personal_prompt}
            ],
            temperature=0.7
        )
        
        personal_text = personal_response.choices[0].message.content.strip()
        
        # Clean up the response to extract JSON
        if '```json' in personal_text:
            personal_text = personal_text.split('```json')[1].split('```')[0].strip()
        elif '```' in personal_text:
            personal_text = personal_text.split('```')[1].split('```')[0].strip()
        
        personal_qa = json.loads(personal_text)
        
        return jsonify({
            'technical': technical_qa[:10],  # Ensure exactly 10
            'personal': personal_qa[:5]      # Ensure exactly 5
        })
        
    except json.JSONDecodeError as e:
        return jsonify({'error': f'Failed to parse AI response: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    api_configured = all([azure_endpoint, azure_key, azure_deployment, azure_api_version])
    return jsonify({
        'status': 'healthy',
        'api_key_configured': api_configured
    })

if __name__ == '__main__':
    if not all([azure_endpoint, azure_key, azure_deployment, azure_api_version]):
        print("\n" + "="*60)
        print("WARNING: Azure OpenAI environment variables are not fully set!")
        print("Required variables:")
        print("  - AZURE_OPENAI_ENDPOINT")
        print("  - AZURE_OPENAI_KEY")
        print("  - AZURE_OPENAI_DEPLOYMENT")
        print("  - AZURE_OPENAI_API_VERSION")
        print("="*60 + "\n")
    
    app.run(debug=True, port=5000)
