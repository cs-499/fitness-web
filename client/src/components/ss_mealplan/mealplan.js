import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';
import './mealplan.css';
import NavBar from "../navbar/nav_bar";
import { useNavigate } from 'react-router-dom';

// Main functional component for setting meal plan goals
const MealPlan = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState();
    const [error, setError] = useState('');

    useEffect(() => {
        document.title = 'Meal Plan Homepage';

        /* 
        const printAll = async () => {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${process.env.REACT_APP_API_HOST}/survey/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                let surveyResponses = await response.json();
                
                surveyResponses = surveyResponses.map(survey => ({
                    ...survey,
                    answers: Object.fromEntries(
                        Object.entries(survey.answers).filter(([question, details]) => details.questionTarget === 'workout')
                    )
                }));
                console.log("Response: ", surveyResponses);
            } catch (error) {
                console.error("Error retrieving survey: ", error);
            }
        }
        printAll();
        */
    }, []);

    const handleNavigate = (searchType) => {
        if (searchType === "BASIC") {
            navigate(`/basicsearch`);
        } else if (searchType === "ADVANCED") {
            navigate(`/advancedsearch`);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <NavBar />
            <div className="navigate-container">
                <button className='BASIC' onClick={() => handleNavigate("BASIC")}>
                    Basic Search
                </button>
                {/*<button className='ADVANCED' onClick={() => handleNavigate("ADVANCED")}>
                    Advanced Search
                </button>*/}
            </div>
            <div className="container">

            </div>
        </div>
    );
};

export default MealPlan;
