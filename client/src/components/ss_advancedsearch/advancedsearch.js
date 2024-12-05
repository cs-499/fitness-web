import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from "../navbar/nav_bar";
import './advancedsearch.css';
import axios from 'axios';

function AdvancedSearch() {
    const [recipes, setRecipes] = useState([]);
    const [recommendation, setRecommendation] = useState("");
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");
    const [calorieGoal, setCalorieGoal] = useState("");
    const [dietGoal, setDietGoal] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();


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

export default AdvancedSearch;