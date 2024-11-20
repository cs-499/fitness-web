import React, { useState, useEffect } from 'react';
import '../../App.css';
import { useNavigate } from 'react-router-dom';
import NavBar from "../navbar/nav_bar";
import './mealgenerator.css';

function MealGenerator() {
    const [recipes, setRecipes] = useState([]);
    const [surveys, setSurveys] = useState([]);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

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

    const handleSearch = () => {
        if (!query.trim()) {
            setError('Please enter a search term before generating recipes');
            return;
        }
        setRecipes([]);
        fetch(`http://localhost:5001/api/recipes?query=${query}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setRecipes(data.results || []))
            .catch(error => setError('Recipe fetch error: ' + error.message));
    };

    return (
        <div>
            <NavBar />
            <div className="searchHeader">
                <h1 className="pageTitle">Meal Plan Recipes</h1>
                <div className="search">
                    <input
                        className="searchBox"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Enter a recipe keyword"
                    />
                    <button className="searchButton" onClick={handleSearch}>Generate</button>
                </div>
            </div>
            <div className="error">{error}</div>
            <div className="recipe-container">
                {recipes.map(recipe => (
                    <div key={recipe.id} className="recipe-item" onClick={() => navigate(`/recipe/${recipe.id}`)}>
                        <img className="recipe-image" src={recipe.image} alt={recipe.title} />
                        <div className="recipe-title">{recipe.title}</div>
                    </div>
                ))}
            </div>
            <div>
                <h2>Survey Data</h2>
                {surveys.length ? surveys.map((survey, index) => (
                    <div key={index}>
                        <p>User ID: {survey.userId}</p>
                        <p>Answers: {JSON.stringify(survey.answers)}</p>
                    </div>
                )) : <p>No surveys found</p>}
            </div>
        </div>
    );
}

export default MealGenerator;