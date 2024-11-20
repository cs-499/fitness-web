import React, { useState, useEffect } from 'react';
import '../../App.css';
import NavBar from "../navbar/nav_bar";
import { useParams } from 'react-router-dom';

function Recipe() {
    const { id } = useParams(); // This retrieves the recipe ID from the URL
    const [recipeDetails, setRecipeDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            setLoading(true);
            try {
                // Assuming the backend to provide details is set up similarly to the list fetch
                const response = await fetch(`http://localhost:5001/api/recipe/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setRecipeDetails(data);
            } catch (err) {
                setError(err.message);
                setRecipeDetails(null);
            }
            setLoading(false);
        };

        fetchRecipeDetails();
    }, [id]); // This ensures the effect runs again if the ID changes

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <NavBar />
            {recipeDetails ? (
                <div>
                    <h1>{recipeDetails.title}</h1>
                    <img src={recipeDetails.image} alt={recipeDetails.title} style={{ width: '300px' }} />
                    <h2>Instructions</h2>
                    <p>{recipeDetails.instructions}</p>
                </div>
            ) : (
                <p>No details available.</p>
            )}
        </div>
    );
}

export default Recipe;