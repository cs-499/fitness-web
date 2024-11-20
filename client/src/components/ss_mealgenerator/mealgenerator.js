import React, { useState, useEffect } from 'react';
import '../../App.css';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from "../navbar/nav_bar";
import './mealgenerator.css';

function MealGenerator() {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");
    const [calorieGoal, setCalorieGoal] = useState("");
    const [workoutGoal, setWorkoutGoal] = useState("");
    const [dietGoal, setDietGoal] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    // Extract query parameters for goals from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setWorkoutGoal(params.get('workoutGoal') || "");
        setDietGoal(params.get('dietGoal') || "");
    }, [location.search]);

    const handleSearch = async () => {
        if (!query.trim() && !calorieGoal.trim()) {
            setError('Please enter a food keyword or calorie goal');
            setRecipes([]);
            return;
        }

        setError(null);
        setRecipes([]);
        const apiKey = "YOUR_SPOONACULAR_API_KEY"; // Replace with your actual Spoonacular API key
        const endpoint = query.trim()
            ? `https://api.spoonacular.com/recipes/complexSearch?query=${query}&maxCalories=${calorieGoal}&diet=${dietGoal}&number=10&apiKey=${apiKey}`
            : `https://api.spoonacular.com/recipes/complexSearch?maxCalories=${calorieGoal}&diet=${dietGoal}&number=10&apiKey=${apiKey}`;

        try {
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error('Failed to fetch recipes');
            const data = await response.json();

            // Fetch detailed nutrition info for each recipe
            const detailedRecipes = await Promise.all(
                data.results.map(recipe =>
                    fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`)
                        .then(res => res.json())
                )
            );

            // Rank recipes based on user goals
            const rankedRecipes = rankRecipes(detailedRecipes, { calorieGoal, dietGoal, workoutGoal });
            setRecipes(rankedRecipes);
        } catch (error) {
            setError(error.message);
        }
    };

    const rankRecipes = (recipes, userGoals) => {
        return recipes.sort((a, b) => {
            const aScore = calculateRecipeScore(a, userGoals);
            const bScore = calculateRecipeScore(b, userGoals);
            return bScore - aScore; // Higher scores rank higher
        });
    };

    const calculateRecipeScore = (recipe, userGoals) => {
        let score = 0;
        if (userGoals.calorieGoal && recipe.nutrition.nutrients.find(n => n.name === "Calories")?.amount <= userGoals.calorieGoal) {
            score += 10;
        }
        if (userGoals.workoutGoal === "muscle gain" && recipe.nutrition.nutrients.find(n => n.name === "Protein")?.amount >= 20) {
            score += 15;
        }
        if (userGoals.dietGoal && recipe.diets.includes(userGoals.dietGoal)) {
            score += 5;
        }
        return score;
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div>
            <NavBar />
            <div className="searchHeader">
                <h1 className="pageTitle">Meal Plan Recipes</h1>
                <p className="instruction">Search for recipes by food keyword or set a calorie goal for recommendations.</p>
                <div className="search">
                    <input
                        className="searchBox"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter a recipe keyword"
                    />
                    <input
                        className="searchBox"
                        type="number"
                        value={calorieGoal}
                        onChange={(e) => setCalorieGoal(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter a calorie goal"
                    />
                    <button className="searchButton" onClick={handleSearch}>Generate</button>
                </div>
            </div>

            {error && <p className="search-handling error">{error}</p>}
            <div className="recipe-container">
                {recipes.length > 0 ? (
                    recipes.map(recipe => (
                        <div
                            key={recipe.id}
                            className="recipe-item"
                            onClick={() => navigate(`/recipe/${recipe.id}`)}
                        >
                            <img
                                className="recipe-image"
                                src={recipe.image}
                                alt={recipe.title}
                            />
                            <div className="recipe-title">{recipe.title}</div>
                            <p>Calories: {recipe.nutrition.nutrients.find(n => n.name === "Calories")?.amount || "N/A"}</p>
                        </div>
                    ))
                ) : (
                    !error && <p className="search-handling">No recipes found. Try another search.</p>
                )}
            </div>
        </div>
    );
}

export default MealGenerator;



/*
    useEffect(() => {
        const userId = getUserId(); // Implement this function based on your auth strategy
        fetchSurvey(userId);
    }, []);

    const fetchSurvey = (userId) => {
        fetch(`http://localhost:5001/api/surveys/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch survey data');
                }
                return response.json();
            })
            .then(data => setSurveys(data))
            .catch(error => setError('Survey fetch error: ' + error.message));
    };

    
<div>
    <h2>Survey Data</h2>
    {surveys.length ? surveys.map((survey, index) => (
        <div key={index}>
            <p>User ID: {survey.userId}</p>
            <p>Answers: {JSON.stringify(survey.answers)}</p>
        </div>
    )) : <p>No surveys found</p>}
</div>
*/
