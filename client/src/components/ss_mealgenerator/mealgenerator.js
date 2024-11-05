import React, { useState, useEffect } from 'react';
import '../../App.css';
import NavBar from "../navbar/nav_bar"
import ParticleSys from '../particles/particle_sys';

function MealGenerator() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        setLoading(true);
        setError(null);

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
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    };

    return (
        <div>
            <NavBar />
            <h1>Meal Plan Recipes</h1>
            
            {/* Input and Search Button */}
            <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter a recipe keyword (e.g., pasta, chicken)"
            />
            <button onClick={handleSearch}>Generate</button>

            {/* Display Recipes or Loading/Error */}
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            <ul>
                {recipes.map(recipe => (
                    <li key={recipe.id}>
                        <h2>{recipe.title}</h2>
                        <img src={recipe.image} alt={recipe.title} style={{ width: '150px' }} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MealGenerator;