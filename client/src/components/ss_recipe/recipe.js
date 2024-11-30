import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../App.css';
import NavBar from "../navbar/nav_bar";
import './recipe.css';
import axios from 'axios';

const Recipe = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            setLoading(true);
            try {
                const apiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;
                if (!apiKey) {
                    throw new Error('Missing API Key. Please set it in your .env file.');
                }

                const { data } = await axios.get(
                    `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${apiKey}`
                );
                setRecipe(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch recipe');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    const saveMeal = () => {
        const savedMeals = JSON.parse(localStorage.getItem('savedMeals')) || [];
        const calories = recipe.nutrition?.nutrients?.find(nutrient => nutrient.name === 'Calories')?.amount || 'N/A';
        const meal = {
            title: recipe.title,
            calories: `${calories} kcal`,
            id: recipe.id,
            timestamp: new Date().toISOString(), // Add ISO timestamp for consistency
        };
        localStorage.setItem('savedMeals', JSON.stringify([...savedMeals, meal]));
        alert('Meal saved to journal!');
    };
    


    if (loading) return <p>Loading recipe...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <NavBar />
            <div className="recipe-container">
                <h1>{recipe?.title || 'Recipe Title'}</h1>
                <img src={recipe?.image} alt={recipe?.title || 'Recipe Image'} />
                <button onClick={saveMeal} style={{
                    backgroundColor: '#1e293b',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    marginTop: '1rem'
                }}>
                    Save Meal
                </button>
                <div className="summary">
                    {recipe?.summary ? recipe.summary.replace(/<[^>]*>/g, '') : 'No summary available.'}
                </div>
                <div className="ingredients-instructions">
                    <div className="ingredients">
                        <h2>Ingredients</h2>
                        <ul>
                            {recipe?.extendedIngredients?.map((ingredient) => (
                                <li key={ingredient.id}>{ingredient.original}</li>
                            )) || <li>No ingredients available.</li>}
                        </ul>
                    </div>
                    <div className="instructions">
                        <h2>Instructions</h2>
                        <ol>
                            {recipe?.analyzedInstructions?.[0]?.steps.map((step) => (
                                <li key={step.number}>{step.step}</li>
                            )) || <li>No instructions available.</li>}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recipe;
