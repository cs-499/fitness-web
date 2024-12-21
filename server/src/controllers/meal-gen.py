from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
from flask_pymongo import PyMongo
import requests

# Load environment variables
load_dotenv()
API_KEY = os.getenv("SPOONACULAR_API")
if not API_KEY:
    raise EnvironmentError("Failed to load SPOONACULAR_API key from environment.")

app = Flask(__name__)
CORS(app)  

# Setup MongoDB connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/api"

def fetch_survey_from_user(user_id, token):
    url = f'http://<node-server-url>/{user_id}'
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        return None

@app.route("/api/recipes", methods=["GET"])
def get_recipes():
    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    url = "https://api.spoonacular.com/recipes/complexSearch"
    params = {
        "apiKey": API_KEY,
        "query": query,
        "number": 9 
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.HTTPError as e:
        return jsonify({"error": "HTTP error: " + str(e)}), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Request failed: " + str(e)}), 500

@app.route("/api/recipe/<int:recipe_id>", methods=["GET"])
def get_recipe(recipe_id):
    url = f"https://api.spoonacular.com/recipes/{recipe_id}/information"
    params = {'apiKey': API_KEY}

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return jsonify(response.json()), 200
    except requests.exceptions.HTTPError as e:
        return jsonify({'error': 'Failed to fetch recipe', 'message': str(e)}), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Network error occurred', 'message': str(e)}), 500
    
@app.route('/search_recipes', methods=['GET'])
def search_recipes():
    query = request.args.get('query')
    cuisine = request.args.get('cuisine')
    intolerances = request.args.get('intolerances')
    diet = request.args.get('diet')
    api_key = API_KEY

    params = {
        'query': query,
        'cuisine': cuisine,
        'intolerances': intolerances,
        'diet': diet,
        'number': 20,
        'apiKey': API_KEY
    }
    
    response = requests.get('https://api.spoonacular.com/recipes/complexSearch', params=params)
    return jsonify(response.json())

@app.route('/get_recipe_taste', methods=['GET'])
def get_recipe_taste():
    recipe_id = request.args.get('id')
    normalize = request.args.get('normalize', 'false')

    if not recipe_id:
        return jsonify({"error": "Recipe ID is required"}), 400

    # Build the Spoonacular API URL
    url = f"https://api.spoonacular.com/recipes/{recipe_id}/tasteWidget.json"
    params = {
        "apiKey": API_KEY,
        "normalize": normalize
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()

        # Parse and return the response
        taste_data = response.json()
        return jsonify(taste_data)

    except requests.exceptions.HTTPError as http_err:
        return jsonify({"error": f"HTTP error occurred: {http_err}"}), response.status_code
    except Exception as err:
        return jsonify({"error": f"An error occurred: {err}"}), 500

if __name__ == "__main__":
    app.run(debug=False, port=5900)