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
            <div className='today_workout'>
                <p>Today's Workout</p>
                <ul className='today_exercises'>
                    <div className='exercisebp' id='bench_press'>
                        <li><a href='/'>Bench press</a></li>
                    </div>
                    <div className='exerciseip' id='incline_press'>
                        <li><a href='/'>incline press</a></li>
                    </div>
                    <div className='exercisecc' id='cable_crossover'>
                        <li><a href='/'>cable crossover</a></li>
                    </div>
                </ul>
            </div>



            <div className='today_mealplan'>
                <p>Today's meals</p>
                <ul className='today_meals'>
                    <div className='mealcereal' id='cereal'>
                        <li><a href='/'>Cereal</a></li>
                    </div>
                </ul>
            </div>

            <ParticleSys />
        </div>
    )
}

export default Homepage;