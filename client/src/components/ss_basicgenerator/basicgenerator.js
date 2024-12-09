import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from "../navbar/nav_bar";
import './basicgenerator.css'; 
import axios from 'axios'; 

const workoutGoals = [
    "gain muscle",
    "lose weight",
    "increase energy",
    "build endurance",
    "boost immunity",
    "improve recovery",
    "enhance strength",
    "increase flexibility"
];

const dietGoals = [
    "high protein",
    "keto",
    "low carb",
    "vegan",
    "vegetarian",
    "paleo",
    "mediterranean",
    "gluten-free",
    "balanced"
];

const foodRecommendations = {};

// Populate the recommendations
workoutGoals.forEach(workout => {
    dietGoals.forEach(diet => {
        const key = `${workout}|${diet}`;

        // Suggest specific foods for each combination

        switch (key) {
            case "gain muscle|high protein":
                foodRecommendations[key] = ["Chicken Breast", "Egg Whites", "Quinoa"];
                break;
            case "gain muscle|keto":
                foodRecommendations[key] = ["Grilled Salmon", "Avocado", "Almond Butter"];
                break;
            case "gain muscle|low carb":
                foodRecommendations[key] = ["Steak", "Asparagus", "Hard-Boiled Eggs"];
                break;
            case "gain muscle|vegan":
                foodRecommendations[key] = ["Tofu", "Lentils", "Quinoa"];
                break;
            case "gain muscle|vegetarian":
                foodRecommendations[key] = ["Paneer", "Greek Yogurt", "Chickpeas"];
                break;
            case "gain muscle|paleo":
                foodRecommendations[key] = ["Grass-Fed Beef", "Sweet Potatoes", "Coconut Oil"];
                break;
            case "gain muscle|mediterranean":
                foodRecommendations[key] = ["Feta Cheese", "Olive Oil", "Grilled Fish"];
                break;
            case "gain muscle|gluten-free":
                foodRecommendations[key] = ["Rice Cakes", "Turkey", "Zucchini Noodles"];
                break;
            case "gain muscle|balanced":
                foodRecommendations[key] = ["Chicken Breast", "Brown Rice", "Steamed Vegetables"];
                break;
        
            case "lose weight|high protein":
                foodRecommendations[key] = ["Lean Turkey", "Cottage Cheese", "Edamame"];
                break;
            case "lose weight|keto":
                foodRecommendations[key] = ["Cauliflower Rice", "Grilled Shrimp", "Avocado"];
                break;
            case "lose weight|low carb":
                foodRecommendations[key] = ["Zucchini Noodles", "Grilled Chicken", "Spinach Salad"];
                break;
            case "lose weight|vegan":
                foodRecommendations[key] = ["Kale Salad", "Chickpea Stew", "Sweet Potatoes"];
                break;
            case "lose weight|vegetarian":
                foodRecommendations[key] = ["Vegetable Soup", "Cottage Cheese", "Quinoa"];
                break;
            case "lose weight|paleo":
                foodRecommendations[key] = ["Grilled Chicken Thighs", "Carrots", "Almonds"];
                break;
            case "lose weight|mediterranean":
                foodRecommendations[key] = ["Hummus", "Tabbouleh", "Grilled Vegetables"];
                break;
            case "lose weight|gluten-free":
                foodRecommendations[key] = ["Quinoa", "Baked Salmon", "Roasted Brussels Sprouts"];
                break;
            case "lose weight|balanced":
                foodRecommendations[key] = ["Turkey", "Brown Rice", "Steamed Vegetables"];
                break;
        
            case "increase energy|high protein":
                foodRecommendations[key] = ["Greek Yogurt", "Hard-Boiled Eggs", "Tuna Salad"];
                break;
            case "increase energy|keto":
                foodRecommendations[key] = ["Nuts", "Cheese Cubes", "Avocado"];
                break;
            case "increase energy|low carb":
                foodRecommendations[key] = ["Chicken Salad", "Cucumber Slices", "Boiled Eggs"];
                break;
            case "increase energy|vegan":
                foodRecommendations[key] = ["Bananas", "Chia Pudding", "Sweet Potatoes"];
                break;
            case "increase energy|vegetarian":
                foodRecommendations[key] = ["Smoothies", "Oatmeal", "Apples"];
                break;
            case "increase energy|paleo":
                foodRecommendations[key] = ["Berries", "Beef Jerky", "Almonds"];
                break;
            case "increase energy|mediterranean":
                foodRecommendations[key] = ["Olive Oil", "Hummus", "Whole Grain Bread"];
                break;
            case "increase energy|gluten-free":
                foodRecommendations[key] = ["Gluten-Free Crackers", "Nut Butter", "Carrot Sticks"];
                break;
            case "increase energy|balanced":
                foodRecommendations[key] = ["Trail Mix", "Hard-Boiled Eggs", "Dark Chocolate"];
                break;
        
            case "build endurance|high protein":
                foodRecommendations[key] = ["Grilled Chicken", "Quinoa", "Edamame"];
                break;
            case "build endurance|keto":
                foodRecommendations[key] = ["Salmon", "Avocado", "Egg Muffins"];
                break;
            case "build endurance|low carb":
                foodRecommendations[key] = ["Turkey", "Steamed Broccoli", "Cauliflower Rice"];
                break;
            case "build endurance|vegan":
                foodRecommendations[key] = ["Lentil Soup", "Brown Rice", "Vegetable Stir Fry"];
                break;
            case "build endurance|vegetarian":
                foodRecommendations[key] = ["Cottage Cheese", "Spinach Salad", "Sweet Potatoes"];
                break;
            case "build endurance|paleo":
                foodRecommendations[key] = ["Grilled Chicken", "Carrots", "Avocado"];
                break;
            case "build endurance|mediterranean":
                foodRecommendations[key] = ["Whole Grains", "Fish", "Olive Oil"];
                break;
            case "build endurance|gluten-free":
                foodRecommendations[key] = ["Baked Salmon", "Rice", "Green Beans"];
                break;
            case "build endurance|balanced":
                foodRecommendations[key] = ["Brown Rice", "Turkey", "Roasted Vegetables"];
                break;

            // Add remaining combinations
            case "boost immunity|high protein":
                foodRecommendations[key] = ["Chicken Soup", "Greek Yogurt", "Boiled Eggs"];
                break;
            case "boost immunity|keto":
                foodRecommendations[key] = ["Avocado", "Salmon", "Walnuts"];
                break;
            case "boost immunity|low carb":
                foodRecommendations[key] = ["Spinach Salad", "Grilled Chicken", "Mushroom Soup"];
                break;
            case "boost immunity|vegan":
                foodRecommendations[key] = ["Broccoli", "Orange", "Chickpea Stew"];
                break;
            case "boost immunity|vegetarian":
                foodRecommendations[key] = ["Greek Yogurt", "Bell Peppers", "Tomato Soup"];
                break;
            case "boost immunity|paleo":
                foodRecommendations[key] = ["Chicken Broth", "Sweet Potatoes", "Berries"];
                break;
            case "boost immunity|mediterranean":
                foodRecommendations[key] = ["Hummus", "Olive Oil", "Lemon Soup"];
                break;
            case "boost immunity|gluten-free":
                foodRecommendations[key] = ["Zucchini Noodles", "Citrus Salad", "Bone Broth"];
                break;
            case "boost immunity|balanced":
                foodRecommendations[key] = ["Chicken Breast", "Brown Rice", "Steamed Broccoli"];
                break;

            case "improve recovery|high protein":
                foodRecommendations[key] = ["Egg Whites", "Tuna", "Protein Shake"];
                break;
            case "improve recovery|keto":
                foodRecommendations[key] = ["Salmon", "Avocado", "Almond Butter"];
                break;
            case "improve recovery|low carb":
                foodRecommendations[key] = ["Chicken Breast", "Zucchini", "Boiled Eggs"];
                break;
            case "improve recovery|vegan":
                foodRecommendations[key] = ["Lentils", "Chickpeas", "Quinoa"];
                break;
            case "improve recovery|vegetarian":
                foodRecommendations[key] = ["Cottage Cheese", "Spinach Salad", "Almonds"];
                break;
            case "improve recovery|paleo":
                foodRecommendations[key] = ["Grass-Fed Beef", "Sweet Potatoes", "Berries"];
                break;
            case "improve recovery|mediterranean":
                foodRecommendations[key] = ["Olive Oil", "Hummus", "Grilled Fish"];
                break;
            case "improve recovery|gluten-free":
                foodRecommendations[key] = ["Quinoa", "Chicken Thighs", "Carrots"];
                break;
            case "improve recovery|balanced":
                foodRecommendations[key] = ["Brown Rice", "Chicken Breast", "Steamed Vegetables"];
                break;

            case "enhance strength|high protein":
                foodRecommendations[key] = ["Grilled Chicken", "Egg Whites", "Steak"];
                break;
            case "enhance strength|keto":
                foodRecommendations[key] = ["Avocado", "Beef Jerky", "Hard-Boiled Eggs"];
                break;
            case "enhance strength|low carb":
                foodRecommendations[key] = ["Zucchini Noodles", "Turkey", "Grilled Vegetables"];
                break;
            case "enhance strength|vegan":
                foodRecommendations[key] = ["Tofu", "Lentils", "Spinach"];
                break;
            case "enhance strength|vegetarian":
                foodRecommendations[key] = ["Paneer", "Greek Yogurt", "Chickpeas"];
                break;
            case "enhance strength|paleo":
                foodRecommendations[key] = ["Grass-Fed Beef", "Sweet Potatoes", "Coconut Oil"];
                break;
            case "enhance strength|mediterranean":
                foodRecommendations[key] = ["Olive Oil", "Feta Cheese", "Grilled Fish"];
                break;
            case "enhance strength|gluten-free":
                foodRecommendations[key] = ["Rice Cakes", "Grilled Chicken", "Steamed Vegetables"];
                break;
            case "enhance strength|balanced":
                foodRecommendations[key] = ["Chicken Breast", "Brown Rice", "Steamed Broccoli"];
                break;

            case "increase flexibility|high protein":
                foodRecommendations[key] = ["Turkey", "Egg Whites", "Quinoa"];
                break;
            case "increase flexibility|keto":
                foodRecommendations[key] = ["Avocado", "Salmon", "Cheese"];
                break;
            case "increase flexibility|low carb":
                foodRecommendations[key] = ["Chicken Salad", "Zucchini Noodles", "Egg Muffins"];
                break;
            case "increase flexibility|vegan":
                foodRecommendations[key] = ["Tofu", "Chia Seeds", "Kale"];
                break;
            case "increase flexibility|vegetarian":
                foodRecommendations[key] = ["Greek Yogurt", "Sweet Potatoes", "Spinach"];
                break;
            case "increase flexibility|paleo":
                foodRecommendations[key] = ["Grilled Chicken", "Carrots", "Almonds"];
                break;
            case "increase flexibility|mediterranean":
                foodRecommendations[key] = ["Hummus", "Olive Oil", "Whole Grain Bread"];
                break;
            case "increase flexibility|gluten-free":
                foodRecommendations[key] = ["Quinoa", "Carrot Sticks", "Chicken Breast"];
                break;
            case "increase flexibility|balanced":
                foodRecommendations[key] = ["Brown Rice", "Turkey", "Steamed Vegetables"];
                break;

            default:
                foodRecommendations[key] = ["General Healthy Food Option 1", "Option 2", "Option 3"];
        }
    });
});

function BasicGenerator() {
    const [recipes, setRecipes] = useState([]);
    const [recommendation, setRecommendation] = useState([]);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");
    const [calorieGoal, setCalorieGoal] = useState("");
    const [dietGoal, setDietGoal] = useState("");
    const [workoutGoal, setWorkoutGoal] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const selectedWorkoutGoal = params.get('workoutGoal') || "";
        const selectedDietGoal = params.get('dietGoal') || "";

        setWorkoutGoal(selectedWorkoutGoal);
        setDietGoal(selectedDietGoal);

        const key = `${selectedWorkoutGoal.toLowerCase()}|${selectedDietGoal.toLowerCase()}`;
        const recommendations = foodRecommendations[key] || [];

        if (recommendations.length > 0) {
            setRecommendation(recommendations);
        } else {
            setError("No recommendations available for the selected combination.");
        }
    }, [location.search]);

    const handleSearch = async () => {
        if (!query.trim()) {
            setError('Please enter a food keyword or choose from the suggestions.');
            return;
        }

        setError(null);
        setIsLoading(true);

        const apiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;
        if (!apiKey) {
            setError('Missing Spoonacular API Key. Please set your Spoonacular API key in the .env file.');
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
                <div className="goal-container">
                    {workoutGoal && <p className="userGoal"><strong>Workout Goal:</strong> {workoutGoal}</p>}
                    {dietGoal && <p className="userGoal"><strong>Diet Goal:</strong> {dietGoal}</p>}
                </div>
                <div className="recommendation-container">
                    {error && <p className="error">{error}</p>}
                    {recommendation.length > 0 && (
                        <div className="recommendation">
                            <p><strong>Recommended Foods for Your Goals:</strong></p>
                            <ul>
                                {recommendation.map((food, index) => (
                                    <li key={index}>{food}</li>
                                ))}
                            </ul>
                        </div>
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

            {isLoading && <p>Loading recommendations...</p>}

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

export default BasicGenerator;