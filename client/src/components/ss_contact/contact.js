// This page will be the Homepage where you see your workouts

// ???????????????? not sure what this page is to be honest, or the css file could be deleted probably - ilian

import React, { useEffect, useState } from 'react';
import '../../App.css';
import './contact.css';
import WorkoutImage from '../images/chest.png';
import WorkoutImage2 from '../images/legs.avif';
import WorkoutImage3 from '../images/biceps.webp';
import WorkoutImage4 from '../images/abs.jpg';
import NavBar from "../navbar/nav_bar";
import ParticleSys from '../particles/particle_sys';

const Contact = () => {
    useEffect(() => {
        document.title = 'ShapeShifter';
    }, []);

    const ImageSlider = () => {
        const images = [WorkoutImage, WorkoutImage2, WorkoutImage3, WorkoutImage4];
        const workoutNames = ["Chest", "Legs", "Biceps", "Abs"];
        const [currentImageIndex, setCurrentImageIndex] = useState(0);

        const goToPrevious = () => {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        };

        const goToNext = () => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        };

        return (
            <div className='today_workout'>
                <img className='body_highlight' src={images[currentImageIndex]} alt="Workout Image" />
                <h1 className='actual_workout'>{workoutNames[currentImageIndex]}</h1>
                <button className="left-arrow" onClick={goToPrevious}>❮</button>
                <button className="right-arrow" onClick={goToNext}>❯</button>
            </div>
        );
    };

    return (
        <div className='all'>
            <NavBar />
            <div className='Workoutout_Meals'>
                <div className='todayW'>
                    <h1 className='category_text'>Today's Workout</h1>
                    <ImageSlider />
                    <div class="button-container">



                    <button 
                        className="start-button" 
                        onClick={() => window.location.href = 'http://localhost:3000/liveworkout'}>
                        Start Workout
                    </button>
                    <button className="end-button">Workout Complete</button>
                    </div>
                </div>


                <div className="meals-section">
                    <h1 className='meal_category'>Planned Meals</h1>

                    <div className="meal-item">
                        <div className="meal-image">
                            <div className="image-placeholder"></div>
                        </div>
                        <div className="meal-info">
                            <h3>Meal name</h3>
                            <p>Other info</p>
                        </div>
                        <button className="log-button">Log</button>
                    </div>

                    <div className="meal-item">
                        <div className="meal-image">
                            <div className="image-placeholder"></div>
                        </div>
                        <div className="meal-info">
                            <h3>Meal name</h3>
                            <p>Other info</p>
                        </div>
                        <button className="log-button">Log</button>
                    </div>

                    <div className="meal-item">
                        <div className="meal-image">
                            <div className="image-placeholder"></div>
                        </div>
                        <div className="meal-info">
                            <h3>Meal name</h3>
                            <p>Other info</p>
                        </div>
                        <button className="log-button">Log</button>
                    </div>
                </div>
            </div>

            <ParticleSys />
        </div>
    );
}


export default Contact;
