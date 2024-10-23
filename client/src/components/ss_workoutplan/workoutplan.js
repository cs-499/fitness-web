//This page will be the Workoutplan page, where you will see the user's specific workout plan

import React from 'react';
import '../../App.css';
import NavBar from "../navbar/nav_bar"
import ParticleSys from '../particles/particle_sys';

const workoutPlan = () => {
    document.title = 'ShapeShifter'
    return(
        <>
            <NavBar />
            Workout plan
        </>
    )
}

export default workoutPlan;