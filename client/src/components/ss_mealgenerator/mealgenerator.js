// Import necessary libraries and components
import React, { useState, useEffect } from 'react'; // Core React functionality and hooks
import { useNavigate, useLocation } from 'react-router-dom'; // React Router for navigation and location handling
import NavBar from "../navbar/nav_bar"; // Importing NavBar component
import './mealgenerator.css'; // Importing CSS file for styling
import axios from 'axios'; // Axios library for making HTTP requests

// Main functional component for generating meals
function MealGenerator() {
    // State variables to manage data and UI state
    const [recipes, setRecipes] = useState([]); // Holds the list of recipes fetched from the API
    const [recommendation, setRecommendation] = useState([]); // Stores food recommendations based on goals
    const [error, setError] = useState(null); // Tracks error messages
    const [query, setQuery] = useState(""); // Tracks the user's search query
    const [calorieGoal, setCalorieGoal] = useState(""); // Tracks the user's calorie goal
    const [dietGoal, setDietGoal] = useState(""); // Tracks the user's diet goal
    const [workoutGoal, setWorkoutGoal] = useState(""); // Tracks the user's workout goal
    const [isLoading, setIsLoading] = useState(false); // Tracks the loading state
    const navigate = useNavigate(); // Hook for programmatic navigation
    const location = useLocation(); // Hook for accessing URL parameters

    // Predefined food recommendations based on workout and diet goals
    const foodRecommendations = {
        // Key format: "workoutGoal|dietGoal"
        "gain muscle|high protein": ["Chicken Breast", "Egg Whites", "Quinoa"],
        "gain muscle|keto": ["Avocado", "Grilled Salmon", "Almond Butter"],
        "lose weight|low carb": ["Zucchini Noodles", "Grilled Chicken", "Spinach Salad"],
        "increase energy|vegan": ["Bananas", "Chia Pudding", "Sweet Potatoes"],
        "build endurance|balanced": ["Brown Rice", "Turkey", "Roasted Vegetables"],
        "boost immunity|vegetarian": ["Broccoli", "Oranges", "Greek Yogurt"],
        "enhance strength|paleo": ["Grass-Fed Beef", "Sweet Potatoes", "Coconut Oil"],
        "increase flexibility|mediterranean": ["Olive Oil", "Hummus", "Whole Grain Bread"],
    };

    // Effect hook to set goals and recommendations based on URL parameters
    useEffect(() => {
        const params = new URLSearchParams(location.search); // Extract query parameters from the URL
        const selectedWorkoutGoal = params.get('workoutGoal') || ""; // Get 'workoutGoal' parameter
        const selectedDietGoal = params.get('dietGoal') || ""; // Get 'dietGoal' parameter

        setWorkoutGoal(selectedWorkoutGoal); // Update workout goal state
        setDietGoal(selectedDietGoal); // Update diet goal state

        // Generate recommendation key and fetch corresponding foods
        const key = `${selectedWorkoutGoal.toLowerCase()}|${selectedDietGoal.toLowerCase()}`;
        const recommendations = foodRecommendations[key] || [];

        // Update recommendation or set error if no match found
        if (recommendations.length > 0) {
            setRecommendation(recommendations);
        } else {
            setError("No recommendations available for the selected combination.");
        }
    }, [location.search]); // Run effect whenever the URL's search parameters change

    // Function to handle recipe search based on user input
    const handleSearch = async () => {
        if (!query.trim()) {
            setError('Please enter a food keyword or choose from the suggestions.'); // Validate input
            return;
        }

        setError(null); // Clear previous error
        setIsLoading(true); // Set loading state to true

        // Retrieve API key from environment variables
        const apiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;
        if (!apiKey) {
            setError('Missing Spoonacular API Key. Please set your Spoonacular API key in the .env file.');
            setIsLoading(false);
            return;
        }

        // Construct API endpoint and parameters
        const endpoint = `https://api.spoonacular.com/recipes/complexSearch`;
        const params = {
            apiKey, // API Key for authentication
            query: query.trim(), // User's search query
            maxCalories: calorieGoal || undefined, // Calorie goal (if provided)
            diet: dietGoal || undefined, // Diet type (if provided)
            number: 10, // Limit number of results
        };

        try {
            const { data } = await axios.get(endpoint, { params }); // Fetch recipes from API
            if (data.results.length === 0) {
                setError('No recipes found. Try adjusting your search criteria.'); // Handle no results
                return;
            }
            setRecipes(data.results); // Update recipes state with API results
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch recipes'); // Handle API errors
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    // Render the component
    return (
        <div>
            <NavBar /> {/* Navigation bar */}
            <div className="searchHeader">
                <h1 className="pageTitle">Meal Plan Recipes</h1>
                <div className="goal-container">
                    {/* Display selected goals */}
                    {workoutGoal && <p className="userGoal"><strong>Workout Goal:</strong> {workoutGoal}</p>}
                    {dietGoal && <p className="userGoal"><strong>Diet Goal:</strong> {dietGoal}</p>}
                </div>
                <div className="recommendation-container">
                    {/* Display recommendations or error messages */}
                    {error && <p className="error">{error}</p>}
                    {recommendation && recommendation.length > 0 && (
                        <div className="recommendation">
                            <p><strong>Recommended Foods for Your Goals:</strong></p>
                            <ul>
                                {recommendation.map((food, index) => (
                                    <li key={index}>{food}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="search">
                    {/* Input fields for search query and calorie goal */}
                    <input
                        className="searchBox"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter a recipe keyword"
                    />
                    <input
                        className="searchBox"
                        type="number"
                        min="0"
                        value={calorieGoal}
                        onChange={(e) => setCalorieGoal(e.target.value)}
                        placeholder="Enter a calorie goal"
                    />
                    <button className="searchButton" onClick={handleSearch}>Generate</button> {/* Trigger search */}
                </div>
            </div>

            {/* Display loading message */}
            {isLoading && <p>Loading recommendations...</p>}

            {/* Display recipe results */}
            <div className="recipe-container">
                {recipes.map((recipe) => (
                    <div
                        key={recipe.id}
                        className="recipe-item"
                        onClick={() => navigate(`/recipe/${recipe.id}`)} // Navigate to recipe details
                    >
                        <img className="recipe-image" src={recipe.image} alt={recipe.title} /> {/* Recipe image */}
                        <div className="recipe-title">{recipe.title}</div> {/* Recipe title */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MealGenerator; // Export component for use in other parts of the app
