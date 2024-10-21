//This page will be the Homepage where you see your workouts

import React from 'react';
import '../../App.css';
import './homepage.css';
import WorkoutImage from '../images/chest.png';
import NavBar from "../navbar/nav_bar";
import ParticleSys from '../particles/particle_sys';

const Homepage = () => {
    document.title = 'ShapeShifter'
    return(
        <div className='all'>
            <NavBar />
            <div className='todayW'>
                <h1 className='category_text'>Today's Workout</h1>
                <div className='today_workout'>
                    <img className='body_highlight' src={WorkoutImage} />
                    <h1 className='actual_workout'>Chest</h1>
                    
                </div>
                <button class="done-button">Workout Complete</button>
                
            </div>
            
            



            <div class="meals-section">
                <h1 className='meal_category'>Planned Meals</h1>

                <div class="meal-item">
                    <div class="meal-image">
                        <div class="image-placeholder"></div>
                    </div>
                    <div class="meal-info">
                        <h3>Meal name</h3>
                        <p>Other info</p>
                    </div>
                    <button class="log-button">Log</button>
                </div>

                <div class="meal-item">
                    <div class="meal-image">
                        <div class="image-placeholder"></div>
                    </div>
                    <div class="meal-info">
                        <h3>Meal name</h3>
                        <p>Other info</p>
                    </div>
                    <button class="log-button">Log</button>
                </div>

                <div class="meal-item">
                    <div class="meal-image">
                        <div class="image-placeholder"></div>
                    </div>
                    <div class="meal-info">
                        <h3>Meal name</h3>
                        <p>Other info</p>
                    </div>
                    <button class="log-button">Log</button>
                </div>
            </div>

            <ParticleSys />
        </div>
    )
}

export default Homepage;