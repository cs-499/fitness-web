import React, { useState } from 'react';
import '../../App.css';
import { useNavigate } from 'react-router-dom';
import NavBar from "../navbar/nav_bar";
// import ParticleSys from '../particles/particle_sys'; // Include if used for visual effects on this page
import './mealgenerator.css';

function MealGenerator() {
    const [recipes, setRecipes] = useState([]);
    // const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();  // Initialize navigate function for routing

    const handleSearch = () => {
        if (!query.trim()) {
            setError('Please enter a search term before generating recipes');
            setRecipes([]);
            // setLoading(false); // Ensure loading is not shown
            return;
        }

        // setLoading(true);
        setError(null);
        setRecipes([]);

        // fetch recipes from the Flask server with the user's query
        fetch(`http://localhost:5001/api/recipes?query=${query}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setRecipes(data.results || []);
                // setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                // setLoading(false);
            });
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
                {/* Input and Search Button */}
                <div className="search">
                    <input className="searchBox"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter a recipe keyword"
                    />
                    <button className="searchButton" onClick={handleSearch}>Generate</button>
                </div>
            </div>

            {/* Display Recipes or Loading/Error */}
            {error && <p className="search-handling">{error}</p>}
            <div className="recipe-container">
                {recipes.map(recipe => (
                    <div key={recipe.id} className="recipe-item" onClick={() => navigate(`/recipe/${recipe.id}`)}>
                        <img className="recipe-image" src={recipe.image} alt={recipe.title} style={{ width: '150px' }} />
                        <div className="recipe-title">{recipe.title}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

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

export default MealGenerator;