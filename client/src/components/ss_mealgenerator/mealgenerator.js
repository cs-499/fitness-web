import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from "../navbar/nav_bar";
import './mealgenerator.css';
import axios from 'axios'; // Import axios here

function MealGenerator() {
    const [recipes, setRecipes] = useState([]);
    const [recommendation, setRecommendation] = useState([]);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");
    const [calorieGoal, setCalorieGoal] = useState("");
    const [dietGoal, setDietGoal] = useState("");
    const [workoutGoal, setWorkoutGoal] = useState(""); // Track user input for workout goals
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Predefined Food Recommendations
    const foodRecommendations = {
        "gain muscle|high protein": ["Chicken Breast", "Egg Whites", "Quinoa"],
        "gain muscle|keto": ["Avocado", "Grilled Salmon", "Almond Butter"],
        "lose weight|low carb": ["Zucchini Noodles", "Grilled Chicken", "Spinach Salad"],
        "increase energy|vegan": ["Bananas", "Chia Pudding", "Sweet Potatoes"],
        "build endurance|balanced": ["Brown Rice", "Turkey", "Roasted Vegetables"],
        "boost immunity|vegetarian": ["Broccoli", "Oranges", "Greek Yogurt"],
        "enhance strength|paleo": ["Grass-Fed Beef", "Sweet Potatoes", "Coconut Oil"],
        "increase flexibility|mediterranean": ["Olive Oil", "Hummus", "Whole Grain Bread"],
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const selectedWorkoutGoal = params.get('workoutGoal') || "";
        const selectedDietGoal = params.get('dietGoal') || "";

        setWorkoutGoal(selectedWorkoutGoal);
        setDietGoal(selectedDietGoal);

        const key = `${selectedWorkoutGoal.toLowerCase()}|${selectedDietGoal.toLowerCase()}`;
        const recommendations = foodRecommendations[key] || [];

        if (recommendations.length > 0) {
            setRecommendation(recommendations);
        } else {
            setError("No recommendations available for the selected combination.");
        }
    }, [location.search]);

    const handleSearch = async () => {
        if (!query.trim()) {
            setError('Please enter a food keyword or choose from the suggestions.');
            return;
        }

        setError(null);
        setIsLoading(true);

        const apiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;
        if (!apiKey) {
            setError('Missing Spoonacular API Key. Please set your Spoonacular API key in the .env file.');
            setIsLoading(false);
            return;
        }

        const endpoint = `https://api.spoonacular.com/recipes/complexSearch`;
        const params = {
            apiKey,
            query: query.trim(),
            maxCalories: calorieGoal || undefined,
            diet: dietGoal || undefined,
            number: 10,
        };

        try {
            const { data } = await axios.get(endpoint, { params });
            if (data.results.length === 0) {
                setError('No recipes found. Try adjusting your search criteria.');
                return;
            }
            setRecipes(data.results);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch recipes');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="searchHeader">
                <h1 className="pageTitle">Meal Plan Recipes</h1>
                <div className="goal-container">
                    {workoutGoal && <p className="userGoal"><strong>Workout Goal:</strong> {workoutGoal}</p>}
                    {dietGoal && <p className="userGoal"><strong>Diet Goal:</strong> {dietGoal}</p>}
                </div>
                <div className="recommendation-container">
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
                    <button className="searchButton" onClick={handleSearch}>Generate</button>
                </div>
            </div>

            {isLoading && <p>Loading recommendations...</p>}
            {error && <p className="error">{error}</p>}
            <div className="recipe-container">
                {recipes.map((recipe) => (
                    <div
                        key={recipe.id}
                        className="recipe-item"
                        onClick={() => navigate(`/recipe/${recipe.id}`)}
                    >
                        <img className="recipe-image" src={recipe.image} alt={recipe.title} />
                        <div className="recipe-title">{recipe.title}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MealGenerator;
