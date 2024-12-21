// Import necessary libraries and components
import React, { useState, useEffect } from 'react'; // React library and hooks for state and side effects
import { useParams } from 'react-router-dom'; // React Router hook for accessing URL parameters
import '../../App.css'; // Global CSS file for styling
import NavBar from "../navbar/nav_bar"; // Navigation bar component
import './recipe.css'; // CSS file specific to the Recipe component
import axios from 'axios'; // Axios library for making HTTP requests

// Functional component for displaying a recipe
const Recipe = () => {
    const { id } = useParams(); // Retrieve the recipe ID from the URL parameters
    const [recipe, setRecipe] = useState(null); // State to hold the recipe data
    const [loading, setLoading] = useState(true); // State to track the loading status
    const [error, setError] = useState(null); // State to track any errors

    // useEffect hook to fetch the recipe data when the component mounts or when the ID changes
    useEffect(() => {
        const fetchRecipe = async () => {
            setLoading(true); // Set loading state to true before fetching data
            try {
                const apiKey = process.env.REACT_APP_SPOONACULAR_API_KEY; // Retrieve API key from environment variables
                if (!apiKey) {
                    throw new Error('Missing API Key. Please set it in your .env file.'); // Throw error if API key is missing
                }

                // Fetch recipe information from the Spoonacular API
                const { data } = await axios.get(
                    `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${apiKey}`
                );
                setRecipe(data); // Update the recipe state with the fetched data
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch recipe'); // Handle any errors during the API call
            } finally {
                setLoading(false); // Set loading state to false after the API call
            }
        };

        fetchRecipe(); // Invoke the fetch function
    }, [id]); // Dependency array ensures the effect runs when the `id` changes

    // Function to save the current recipe to the local storage
    const saveMeal = () => {
        const savedMeals = JSON.parse(localStorage.getItem('savedMeals')) || []; // Retrieve saved meals from localStorage
        const calories = recipe.nutrition?.nutrients?.find(nutrient => nutrient.name === 'Calories')?.amount || 'N/A'; // Get calorie information
        const meal = {
            title: recipe.title, // Recipe title
            calories: `${calories} kcal`, // Calorie value with units
            id: recipe.id, // Recipe ID
            timestamp: new Date().toISOString(), // Add ISO timestamp for consistency
        };
        localStorage.setItem('savedMeals', JSON.stringify([...savedMeals, meal])); // Save the meal to localStorage
        alert('Meal saved to journal!'); // Notify the user
    };

    // Show a loading message if data is still being fetched
    if (loading) return <p>Loading recipe...</p>;

    // Show an error message if there was a problem fetching the recipe
    if (error) return <p>Error: {error}</p>;

    // Render the recipe details
    return (
        <div>
            <NavBar /> {/* Include the navigation bar */}
            <div className="recipe-container">
                <h1>{recipe?.title || 'Recipe Title'}</h1> {/* Display the recipe title or a placeholder */}
                <img src={recipe?.image} alt={recipe?.title || 'Recipe Image'} /> {/* Display the recipe image */}
                <button
                    onClick={saveMeal}
                    style={{
                        backgroundColor: '#1e293b', // Button background color
                        color: 'white', // Button text color
                        padding: '0.75rem 1.5rem', // Button padding
                        border: 'none', // No border
                        borderRadius: '8px', // Rounded corners
                        cursor: 'pointer', // Pointer cursor on hover
                        fontSize: '1rem', // Font size
                        fontWeight: 'bold', // Bold font weight
                        marginTop: '1rem', // Top margin
                    }}
                >
                    Save Meal
                </button>
                <div className="summary">
                    {/* Display the recipe summary, removing any HTML tags */}
                    {recipe?.summary ? recipe.summary.replace(/<[^>]*>/g, '') : 'No summary available.'}
                </div>
                <div className="ingredients-instructions">
                    <div className="ingredients">
                        <h2>Ingredients</h2> {/* Section for ingredients */}
                        <ul>
                            {/* Display the list of ingredients or a placeholder if unavailable */}
                            {recipe?.extendedIngredients?.map((ingredient) => (
                                <li key={ingredient.id}>{ingredient.original}</li>
                            )) || <li>No ingredients available.</li>}
                        </ul>
                    </div>
                    <div className="instructions">
                        <h2>Instructions</h2> {/* Section for instructions */}
                        <ol>
                            {/* Display the list of instructions or a placeholder if unavailable */}
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

export default Recipe; // Export the component for use in other parts of the application
