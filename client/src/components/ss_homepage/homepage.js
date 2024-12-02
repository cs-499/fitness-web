// This page will be the Homepage where you see your workouts

import React, { useEffect, useState } from 'react';
import '../../App.css';
import './homepage.css';
import WorkoutImage from '../images/chest.png';
import WorkoutImage2 from '../images/legs.avif';
import WorkoutImage3 from '../images/biceps.webp';
import WorkoutImage4 from '../images/abs.jpg';
import { fetchWorkoutPlansFromBackend } from '../ss_workoutplan/workoutPlanService';
import NavBar from "../navbar/nav_bar";

async function getWorkoutNames(userId) {
    const workoutList = [];
        const workoutPlans = await fetchWorkoutPlansFromBackend(userId);
        const obj = JSON.parse(JSON.stringify(workoutPlans));
        const todayDate = new Date().toISOString().split('T')[0];

        for (const date in obj) {
            if(date === todayDate){
                const text = obj[date];
                const match = text.match(/^(?:\*\*|)\s*([A-Za-z\s\-]+):?/);
                if(match){
                    workoutList.push(match[1].trim());
                }
            }
        }
        console.log(workoutList);
        return workoutList;    
}

const Homepage = () => {
    document.title = 'ShapeShifter';

    const images = [WorkoutImage, WorkoutImage2, WorkoutImage3, WorkoutImage4];
    const [workoutNames, setWorkoutNames] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [dataFetched, setDataFetched] = useState(false);

    useEffect(() => {
        const fetchWorkouts = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                const names = await getWorkoutNames(userId);
                setWorkoutNames(names);
                setDataFetched(true);
            }
        };
        fetchWorkouts();
    }, [dataFetched]); 

    const goToPrevious = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    return (
        <>
        {/*Navigation bar*/}
        <NavBar /> 

        <div className='all'>    
            {/*All the stuff to do with workouts (Left side of the screen)*/}
            <div className='Workout_Section'>
                <h1 className='test'>Today's Workout</h1>
                <div className='Workout'>
                    <img className='body_highlight' src={images[currentImageIndex]} alt="Workout Image" />
                    <h1 className='Workout_Title'>
                        {workoutNames[currentImageIndex] || "Loading..."}
                    </h1>
                    <button className="left-arrow" onClick={goToPrevious}>❮</button>
                    <button className="right-arrow" onClick={goToNext}>❯</button>
                </div>

                {/*Workout Complete*/}
                <div>
                    <button className='Bottom_Button'>Workout Complete</button>
                </div>
            </div>



            {/*All the stuff related to meals (Right side of the screen) */}
            <div className="Meal_Section">
                <h1>Planned Meals</h1>

                <div className="Meal_Items">
                    <div className="item">
                        <div className="image">
                            <div className="image-placeholder"></div>
                        </div>
                        <div className="info">
                            <h3>Meal name</h3>
                            <p>Other info</p>
                        </div>
                        <button className="log-button">Log</button>
                    </div>

                    <div className="item">
                        <div className="image">
                            <div className="image-placeholder"></div>
                        </div>
                        <div className="info">
                            <h3>Meal name</h3>
                            <p>Other info</p>
                        </div>
                        <button className="log-button">Log</button>
                    </div>

                    <div className="item">
                        <div className="image">
                            <div className="image-placeholder"></div>
                        </div>
                        <div className="info">
                            <h3>Meal name</h3>
                            <p>Other info</p>
                        </div>
                        <button className="log-button">Log</button>
                    </div>
                </div>
                
            </div>
        </div>
        </>
        
    );
}

export default Homepage;