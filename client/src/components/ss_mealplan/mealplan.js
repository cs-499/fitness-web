// Import necessary libraries and components
import React, { useState } from 'react'; // React library and useState hook for state management
import '../../App.css'; // Main CSS file for global styling
import './mealplan.css'; // CSS file specific to the MealPlan component
import NavBar from "../navbar/nav_bar"; // NavBar component for navigation
import { useNavigate } from 'react-router-dom'; // React Router hook for programmatic navigation

// Main functional component for setting meal plan goals
const MealPlan = () => {
    document.title = 'ShapeShifter'; // Set the document title for the browser tab

    // State variables for tracking user-selected goals
    const [workoutGoal, setWorkoutGoal] = useState(''); // Tracks the selected workout goal
    const [dietGoal, setDietGoal] = useState(''); // Tracks the selected diet goal
    const navigate = useNavigate(); // Hook for navigation to other routes

    // Function to handle navigation to the meal generator page with selected goals
    const handleNavigate = () => {
        // Check if both workout and diet goals are selected
        if (!workoutGoal.trim() || !dietGoal.trim()) {
            alert("Please select both a workout goal and a diet goal to proceed."); // Show alert if input is incomplete
            return;
        }

        // Construct URL parameters for navigation
        const params = new URLSearchParams({ workoutGoal, dietGoal }).toString();
        navigate(`/mealgenerator?${params}`); // Navigate to the meal generator page with query parameters
    };

    return (
        <>
            <NavBar /> {/* Include the navigation bar */}
            <div className="meal-plan-container">
                <h1 className="page-title">Meal Plan</h1> {/* Page title */}
                <div className="goal-inputs">
                    <h2 className="subtitle">Set Your Goals</h2> {/* Subtitle for the goal input section */}

                    {/* Workout Goal Dropdown */}
                    <div className="input-group">
                        <label>Workout Goal:</label> {/* Label for the workout goal dropdown */}
                        <select
                            value={workoutGoal} // Bind state to the dropdown
                            onChange={(e) => setWorkoutGoal(e.target.value)} // Update state on selection
                            className="dropdown" // Apply styling to the dropdown
                        >
                            <option value="">Select a Workout Goal</option> {/* Placeholder option */}
                            <option value="gain muscle">Gain Muscle</option>
                            <option value="lose weight">Lose Weight</option>
                            <option value="increase energy">Increase Energy</option>
                            <option value="build endurance">Build Endurance</option>
                            <option value="boost immunity">Boost Immunity</option>
                            <option value="improve recovery">Improve Recovery</option>
                            <option value="enhance strength">Enhance Strength</option>
                            <option value="increase flexibility">Increase Flexibility</option>
                        </select>
                    </div>

                    {/* Diet Goal Dropdown */}
                    <div className="input-group">
                        <label>Diet Goal:</label> {/* Label for the diet goal dropdown */}
                        <select
                            value={dietGoal} // Bind state to the dropdown
                            onChange={(e) => setDietGoal(e.target.value)} // Update state on selection
                            className="dropdown" // Apply styling to the dropdown
                        >
                            <option value="">Select a Diet Goal</option> {/* Placeholder option */}
                            <option value="high protein">High Protein</option>
                            <option value="keto">Keto</option>
                            <option value="low carb">Low Carb</option>
                            <option value="vegan">Vegan</option>
                            <option value="vegetarian">Vegetarian</option>
                            <option value="paleo">Paleo</option>
                            <option value="mediterranean">Mediterranean</option>
                            <option value="gluten-free">Gluten-Free</option>
                            <option value="balanced">Balanced</option>
                        </select>
                    </div>

                    {/* Button to trigger meal plan generation */}
                    <button onClick={handleNavigate} className="generate-button">
                        Generate Meal Plan
                    </button>
                </div>
            </div>
        </>
    );
};

export default MealPlan; // Export the component for use in other parts of the application
