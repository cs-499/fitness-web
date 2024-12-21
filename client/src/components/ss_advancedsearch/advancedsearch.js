import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from "../navbar/nav_bar";
import './advancedsearch.css';
import axios from 'axios';

function AdvancedSearch() {
    const [recipes, setRecipes] = useState([]);
    const [displayRecipes, setDisplayRecipes] = useState([]);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [cuisine, setCuisine] = useState('');
    const [intolerances, setIntolerances] = useState('');
    const [diet, setDiet] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    // taste state
    const [sweetness, setSweetness] = useState('');
    const [saltiness, setSaltiness] = useState('');
    const [sourness, setSourness] = useState('');
    const [bitterness, setBitterness] = useState('');
    const [savoriness, setSavoriness] = useState('');
    const [fattiness, setFattiness] = useState('');
    const [spiciness, setSpiciness] = useState('');

    const navigate = useNavigate();


    // Define the dropdown options
    const cuisineOptions = ["African", "Asian", "American", "British", "Cajun", "Caribbean",
        "Chinese", "Eastern European", "European", "French", "German", "Greek", "Indian", 
        "Irish", "Italian", "Japanese", "Jewish", "Korean", "Latin American","Mediterranean", 
        "Mexican", "Middle Eastern", "Nordic", "Southern", "Spanish", "Thai", "Vietnamese"
    ];
    const intoleranceOptions = ["Dairy",  "Egg",  "Gluten", "Grain", "Seafood", "Sesame", 
        "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat", "Peanut"
    ];
    const dietOptions = ["Gluten Free", "Ketogenic", "Lacto-Vegetarian", "Low-FODMAP",
        "Ovo-Vegetarian", "Paleo", "Pescetarian", "Primal", "Vegan", "Vegetarian", "Whole30"
    ];
    const pageSize = 10;

    const fetchRecipes = async () => {
        if (!query) {
            setError('Please enter a search keyword.');
            return;
        }
        setIsLoading(true);

        // Create params only if values are selected
        const params = new URLSearchParams({ query });
        if (cuisine) params.append('cuisine', cuisine);
        if (intolerances) params.append('intolerances', intolerances);
        if (diet) params.append('diet', diet);

        try {
            const response = await axios.get(`/api/flask/search_recipes?${params.toString()}`);
            if (response.data && response.data.results) {
                let recipesToFilter = response.data.results;
                if (showMoreOptions) {
                    recipesToFilter = await filterByTaste(recipesToFilter);
                    setFilteredRecipes(recipesToFilter);
                    setDisplayRecipes(recipesToFilter.slice(0, pageSize));
                    setCurrentIndex(pageSize);
                } else {
                    setRecipes(response.data.results);
                    setDisplayRecipes(response.data.results.slice(0, pageSize));
                    setCurrentIndex(pageSize);
                }
            } else {
                setRecipes([]);
                setDisplayRecipes([]);
                setError('No results found.');
            }
        } catch (error) {
            setError('Failed to fetch recipes.');
            console.error("Fetching recipes failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRecipeTaste = async (recipeId) => {
        try {
            const response = await axios.get(`/api/flask/get_recipe_taste?id=${recipeId}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch taste data for recipe ${recipeId}:`, error);
            return null;
        }
    };

    const filterByTaste = async (recipes) => {
        const filteredRecipes = [];
        const limitedRecipes = recipes.slice(0, 20);

        const hasTasteFilters = [sweetness, saltiness, sourness, bitterness, savoriness, fattiness, spiciness]
        .some(value => value);

        if (!hasTasteFilters) {
            return recipes;
        }
    
        for (const recipe of limitedRecipes) {
            const tasteData = await fetchRecipeTaste(recipe.id);
    
            if (!tasteData) continue;
    
            // Check taste parameters, ignoring unspecified ones
            const conditions = [
                sweetness && !isNaN(sweetness) && Math.abs(tasteData.sweetness - sweetness) <= 5,
                saltiness && !isNaN(saltiness) && Math.abs(tasteData.saltiness - saltiness) <= 5,
                sourness && !isNaN(sourness) && Math.abs(tasteData.sourness - sourness) <= 5,
                bitterness && !isNaN(bitterness) && Math.abs(tasteData.bitterness - bitterness) <= 5,
                savoriness && !isNaN(savoriness) && Math.abs(tasteData.savoriness - savoriness) <= 5,
                fattiness && !isNaN(fattiness) && Math.abs(tasteData.fattiness - fattiness) <= 5,
                spiciness && !isNaN(spiciness) && tasteData.spiciness === parseInt(spiciness, 10)
            ].filter(Boolean);
    
            if (conditions.every(condition => condition)) {
                filteredRecipes.push(recipe);
            }
        }
    
        return filteredRecipes;
    };


    const handleLoadMore = () => {
        const nextRecipes = showMoreOptions 
            ? filteredRecipes.slice(currentIndex, currentIndex + pageSize) 
            : recipes.slice(currentIndex, currentIndex + pageSize);

        setDisplayRecipes([...displayRecipes, ...nextRecipes]);
        setCurrentIndex(currentIndex + pageSize);
    };

    return (
        <div className='advance-search-container'>
            <NavBar />
            <div className="searchHeader">
                <h1 className="pageTitle">Meal Plan Recipes</h1>
                <div className="search">
                    <div className='initial-input-options'>
                        <input
                            className="searchBox"
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                fetchRecipes();
                                }
                            }}
                            placeholder="Enter a recipe keyword"
                        />
                        <select className="searchBox" value={cuisine} disabled={showMoreOptions} onChange={(e) => setCuisine(e.target.value)}>
                            <option value="">Select Cuisine</option>
                            {cuisineOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <select className="searchBox" value={intolerances} disabled={showMoreOptions} onChange={(e) => setIntolerances(e.target.value)}>
                            <option value="">Select Intolerances</option>
                            {intoleranceOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <select className="searchBox" value={diet} disabled={showMoreOptions} onChange={(e) => setDiet(e.target.value)}>
                            <option value="">Select Diet</option>
                            {dietOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className='button-options-container'>
                        <button onClick={fetchRecipes} className="submitBtn">Search Recipes</button>
                        <button onClick={() => setShowMoreOptions(!showMoreOptions)} className="moreOptionsBtn">
                            {showMoreOptions ? 'Hide Options' : 'More Options'}
                        </button>
                    </div>
                </div>
                {showMoreOptions && (
                    <div className="taste-options">
                        <input
                            className="tasteInput"
                            type="number"
                            value={spiciness}
                            onChange={(e) => setSpiciness(e.target.value)}
                            placeholder="Spiciness (Scoville)"
                        />
                        {["Sweetness", "Saltiness", "Sourness", "Bitterness", "Savoriness", "Fattiness"].map((taste) => (
                            <input
                                key={taste}
                                className="tasteInput"
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                value={eval(taste.toLowerCase())}
                                onChange={(e) => eval(`set${taste}(e.target.value)`)}
                                onBlur={(e) => {
                                    const roundedValue = Math.round(e.target.value / 5) * 5;
                                    eval(`set${taste}(Math.min(100, Math.max(0, roundedValue)))`);
                                }}
                                placeholder={`${taste} (0-100)`}
                            />
                        ))}
                    </div>
                )}
                {isLoading ? (
                    <p>Loading recipes...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <p>{recipes.length > 0 ? `${recipes.length} results found` : ''}</p>
                )}
            </div>
            <div className="recipe-container">
                {displayRecipes.map((recipe) => (
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
            {recipes.length > currentIndex && (
                <button onClick={handleLoadMore} className="loadMore">Load More</button>
            )}
        </div>
    );
}

export default AdvancedSearch;