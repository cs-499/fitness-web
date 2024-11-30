import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from "../navbar/nav_bar";
import './mealgenerator.css';
import axios from 'axios';

function MealGenerator() {
    const [recipes, setRecipes] = useState([]);
    const [recommendation, setRecommendation] = useState("");
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");
    const [calorieGoal, setCalorieGoal] = useState("");
    const [dietGoal, setDietGoal] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setDietGoal(params.get('dietGoal') || "");
        setQuery(params.get('workoutGoal') || "");
        fetchRecommendation(params.get('workoutGoal'), params.get('dietGoal'));
    }, [location.search]);

    const fetchRecommendation = async (workoutGoal, dietGoal) => {
        if (!workoutGoal && !dietGoal) return;
        setIsLoading(true);
        try {
            const apiKey = process.env.REACT_APP_OPENAI_API_KEY; // Replace with your API key
            const response = await axios.post(
                "https://api.openai.com/v1/completions",
                {
                    model: "text-davinci-003",
                    prompt: `Provide a short recommendation of foods for someone with the workout goal "${workoutGoal}" and diet goal "${dietGoal}".`,
                    max_tokens: 50,
                },
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                    },
                }
            );
            setRecommendation(response.data.choices[0].text.trim());
        } catch (err) {
            console.error("Error fetching recommendation:", err);
            setError("Failed to fetch food recommendations. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!query.trim() && !calorieGoal.trim()) {
            setError('Please enter a food keyword or calorie goal');
            return;
        }

        setError(null);
        setIsLoading(true);

        const apiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;
        if (!apiKey) {
            setError('Missing API Key. Please set your Spoonacular API key in the .env file.');
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
                <div className="recommendation-container">
                    {recommendation && (
                        <p className="recommendation">
                            Recommended Foods: {recommendation}
                        </p>
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

            {isLoading && <p>Loading recipes...</p>}
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
