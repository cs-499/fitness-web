//This page will be the mealplan page, where you will see the users particular mealplan

import React from 'react';
import '../../App.css';
import NavBar from "../navbar/nav_bar"
import ParticleSys from '../particles/particle_sys';

const mealPlan = () => {
    document.title = 'ShapeShifter'
    return(
        <>
            <NavBar />
            Meal plan!
        </>
    )
}

export default mealPlan;