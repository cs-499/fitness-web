//This page will be the mealplan page, where you will see the users particular mealplan

import React, { useState, useEffect } from 'react';
import '../../App.css';
import NavBar from "../navbar/nav_bar"
import ParticleSys from '../particles/particle_sys';

const mealPlan = () => {
    document.title = 'ShapeShifter'
    const handleNavigate = () => {
        window.location.href = '/mealgenerator';
    };

    return (
        <>
            <NavBar />
            <h1>Meal Plan</h1>
            <button onClick={handleNavigate}>Go to Meal Generator</button>
        </>
    );
}

export default mealPlan;