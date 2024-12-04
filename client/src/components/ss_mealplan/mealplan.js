import React, { useState } from 'react';
import '../../App.css';
import './mealplan.css';
import NavBar from "../navbar/nav_bar";
import { useNavigate } from 'react-router-dom';
import './mealplan.css';

const MealPlan = () => {
    document.title = 'ShapeShifter';

    const [workoutGoal, setWorkoutGoal] = useState('');
    const [dietGoal, setDietGoal] = useState('');
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (!workoutGoal.trim() || !dietGoal.trim()) {
            alert("Please select both a workout goal and a diet goal to proceed.");
            return;
        }
        const params = new URLSearchParams({ workoutGoal, dietGoal }).toString();
        navigate(`/mealgenerator?${params}`);
    };

    return (
        <>
            <NavBar />
            <div className="meal-plan-container">
                <h1 className="page-title">Meal Plan</h1>
                <div className="goal-inputs">
                    <h2 className="subtitle">Set Your Goals</h2>

                    {/* Workout Goal Dropdown */}
                    <div className="input-group">
                        <label>Workout Goal:</label>
                        <select
                            value={workoutGoal}
                            onChange={(e) => setWorkoutGoal(e.target.value)}
                            className="dropdown"
                        >
                            <option value="">Select a Workout Goal</option>
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
                        <label>Diet Goal:</label>
                        <select
                            value={dietGoal}
                            onChange={(e) => setDietGoal(e.target.value)}
                            className="dropdown"
                        >
                            <option value="">Select a Diet Goal</option>
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

                    <button onClick={handleNavigate} className="generate-button">
                        Generate Meal Plan
                    </button>
                </div>
            </div>
        </>
    );
};

export default MealPlan;

