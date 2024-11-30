import React, { useState } from 'react';
import '../../App.css';
import './mealplan.css';
import NavBar from "../navbar/nav_bar";
import { useNavigate } from 'react-router-dom';

const MealPlan = () => {
    document.title = 'ShapeShifter';

    const [workoutGoal, setWorkoutGoal] = useState('');
    const [dietGoal, setDietGoal] = useState('');
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (!workoutGoal.trim() && !dietGoal.trim()) {
            alert("Please provide at least one goal to proceed.");
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
                    <div className="input-group">
                        <label>Workout Goal:</label>
                        <input
                            type="text"
                            value={workoutGoal}
                            onChange={(e) => setWorkoutGoal(e.target.value)}
                            placeholder="E.g., Gain muscle, lose weight"
                        />
                    </div>
                    <div className="input-group">
                        <label>Diet Goal:</label>
                        <input
                            type="text"
                            value={dietGoal}
                            onChange={(e) => setDietGoal(e.target.value)}
                            placeholder="E.g., High protein, keto"
                        />
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
