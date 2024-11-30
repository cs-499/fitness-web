import React, { useState } from 'react';
import '../../App.css';
import NavBar from "../navbar/nav_bar";

const MealPlan = () => {
    document.title = 'ShapeShifter';

    const [workoutGoal, setWorkoutGoal] = useState('');
    const [dietGoal, setDietGoal] = useState('');
    const handleNavigate = () => {
        // Pass goals as query parameters
        const params = new URLSearchParams({ workoutGoal, dietGoal }).toString();
        window.location.href = `/mealgenerator?${params}`;
    };

    return (
        <>
            <NavBar />
            <h1>Meal Plan</h1>
            <div className="goal-inputs">
                <h2>Set Your Goals</h2>
                <div>
                    <label>Workout Goal:</label>
                    <input
                        type="text"
                        value={workoutGoal}
                        onChange={(e) => setWorkoutGoal(e.target.value)}
                        placeholder="E.g., Gain muscle, lose weight"
                    />
                </div>
                <div>
                    <label>Diet Goal:</label>
                    <input
                        type="text"
                        value={dietGoal}
                        onChange={(e) => setDietGoal(e.target.value)}
                        placeholder="E.g., High protein, keto"
                    />
                </div>
                <button onClick={handleNavigate}>Generate Meal Plan</button>
            </div>
        </>
    );
};

export default MealPlan;
