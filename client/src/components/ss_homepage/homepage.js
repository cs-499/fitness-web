//This page will be the Homepage where you see your workouts

import React from 'react';
import '../../App.css';
import './homepage.css';
import NavBar from "../navbar/nav_bar"
import ParticleSys from '../particles/particle_sys';

const Homepage = () => {
    document.title = 'ShapeShifter'
    return(
        <div className='all'>
            <NavBar />
            <div className='todayW'>
                <p>Today's Workout</p>
                <div className='today_workout'>
                    
                </div>
            </div>
            



            <div className='today_mealplan'>
                <p>Today's meals</p>
                <ul className='today_meals'>

                </ul>
            </div>

            <ParticleSys />
        </div>
    )
}

export default Homepage;