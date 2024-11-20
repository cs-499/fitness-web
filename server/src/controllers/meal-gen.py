from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# load API from env
load_dotenv()
API_KEY = os.getenv("SPOONACULAR_API")

app = Flask(__name__)
CORS(app)  #enable cross resoruce sharing

@app.route("/api/recipes", methods=["GET"])
def get_recipes():
    # Get the 'query' parameter from the request, return an error if not provided
    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    url = "https://api.spoonacular.com/recipes/complexSearch"
    headers = {"Content-Type": "application/json"}
    params = {
        "apiKey": API_KEY,
        "query": query,
        "number": 5  # Limit the number of results
    }

    try:
        # Make a GET request to the Spoonacular API
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Raise an error for HTTP errors
        return jsonify(response.json())  # Return the JSON data from the API
    except requests.exceptions.RequestException as e:
        # Return an error message and 500 status code if the request fails
        return jsonify({"error": str(e)}), 500

# Run the Flask server on port 5001
if __name__ == "__main__":
    app.run(debug=False, port=5001)