import React, { useState, useEffect } from 'react';
import '../../App.css';
import './mealplan.css';
import NavBar from "../navbar/nav_bar";
import { useNavigate } from 'react-router-dom';

const MealPlan = () => {
    const [workoutGoal, setWorkoutGoal] = useState('');
    const [dietGoal, setDietGoal] = useState('');
    const navigate = useNavigate();
    const [surveyData, setSurveyData] = useState([]);

    useEffect(() => {
        document.title = 'Meal Plan Homepage';
        fetchSurveyData().then(data => {
            if (data && data.length > 0) {
                const formattedData = data.flatMap(survey => survey.answers.map(entry => ({
                    question: entry[0], // question
                    values: entry[1].value, // value and questiontarget
                    // questionTarget: entry[1].questionTarget
                })));
                setSurveyData(formattedData);
                // console.log("Formatted Survey Data:", formattedData);
            }
        }).catch(error => {
            console.error("Failed to fetch data on mount:", error);
        });
    }, []);

    async function fetchSurveyData() {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
        try {
            const apiURL = `${process.env.REACT_APP_API_HOST}/survey/${userId}?questionTarget=meal`;
            const response = await fetch(apiURL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                console.error('No survey data found for this user');
                return []; // Return an empty array to handle failures gracefully
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching survey data:', error);
            return [];
        }
    }

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