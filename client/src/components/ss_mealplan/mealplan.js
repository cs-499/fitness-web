import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';
import './mealplan.css';
import NavBar from "../navbar/nav_bar";
import { useNavigate } from 'react-router-dom';

const MealPlan = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState();
    const [error, setError] = useState('');

    useEffect(() => {
        document.title = 'Meal Plan Homepage';
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
                <button className='ADVANCED' onClick={() => handleNavigate("ADVANCED")}>
                    Advanced Search
                </button>
            </div>
            <div className="container">

            </div>
        </div>
    );
};

export default MealPlan;