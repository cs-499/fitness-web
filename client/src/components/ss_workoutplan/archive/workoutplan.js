import React, { useEffect, useState } from 'react';
import '../../App.css';
import './workoutplan.css';
import NavBar from "../navbar/nav_bar";
import ParticleSys from '../particles/particle_sys';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const EnhancedWorkoutPlan = () => {
    useEffect(() => {
        document.title = 'ShapeShifter Enhanced';
    }, []);

    const [workoutCompletion, setWorkoutCompletion] = useState([true, false, true, false, true, true, false]);
    const [stats, setStats] = useState({
        workoutsCompleted: 5,
        caloriesBurned: 4200,
        avgWorkoutDuration: "1 hr 15 min",
    });
    const [editableStats, setEditableStats] = useState({ ...stats });

    const calorieData = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
            {
                label: "Calories Burned",
                data: [500, 600, 550, 700, 800, 750, 850],
                fill: true,
                backgroundColor: 'rgba(23, 162, 184, 0.3)',
                borderColor: "#17a2b8",
                tension: 0.3,
                pointStyle: 'circle',
                pointBorderColor: "#164C7A",
                pointBackgroundColor: "#1A6DB3",
                pointRadius: 5,
                hoverRadius: 7
            },
        ],
    };

    const weeklyCompletionData = {
        labels: ['Completed', 'Pending'],
        datasets: [{
            data: [stats.workoutsCompleted, 7 - stats.workoutsCompleted],
            backgroundColor: ['#164C7A', '#e0e0e0'],
            hoverBackgroundColor: ['#1A6DB3', '#d6d6d6']
        }]
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableStats({ ...editableStats, [name]: value });
    };

    const handleUpdateStats = () => {
        setStats(editableStats);
    };

    return (
        <div className='enhanced-workout-page'>
            <NavBar />
            <div className='dashboard'>
                
                <div className='forecast-chart'>
                    <h2>Calorie Burn Forecast</h2>
                    <Line data={calorieData} />
                </div>

                <div className='workout-tracker widget'>
                    <h3>Daily Workout Tracker</h3>
                    <ul>
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                            <li key={index}>
                                {day}: {workoutCompletion[index] ? "✅" : "❌"}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className='weekly-goals'>
                    <h3>Weekly Goals</h3>
                    <p>Calories Burned: Target 4500 kcal</p>
                    <p>Workout Sessions: Target 5/7</p>
                    <p>Muscle Groups: Chest, Legs, Biceps, Abs</p>
                    <Doughnut data={weeklyCompletionData} />
                </div>

                <div className='stats-section'>
                    <h2 className='section-title'>Progress Stats</h2>
                    <div className='stat-box'>
                        <h3>Workouts Completed</h3>
                        <p>{stats.workoutsCompleted}/7</p>
                    </div>
                    <div className='stat-box'>
                        <h3>Calories Burned</h3>
                        <p>{stats.caloriesBurned} kcal</p>
                    </div>
                    <div className='stat-box'>
                        <h3>Average Workout Duration</h3>
                        <p>{stats.avgWorkoutDuration}</p>
                    </div>
                </div>

                {/* Editable Stats Section */}
                <div className='edit-section widget'>
                    <h3>Update Your Stats</h3>
                    <div>
                        <label className='edit-label'>Workouts Completed</label>
                        <input
                            className='editable-input'
                            type="number"
                            name="workoutsCompleted"
                            value={editableStats.workoutsCompleted}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className='edit-label'>Calories Burned</label>
                        <input
                            className='editable-input'
                            type="number"
                            name="caloriesBurned"
                            value={editableStats.caloriesBurned}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className='edit-label'>Avg Workout Duration</label>
                        <input
                            className='editable-input'
                            type="text"
                            name="avgWorkoutDuration"
                            value={editableStats.avgWorkoutDuration}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button className='update-button' onClick={handleUpdateStats}>
                        Update Stats
                    </button>
                </div>

                <div className='exercise-library widget'>
                    <h3>Exercise Library</h3>
                    <ul>
                        <li>Push-ups - Chest</li>
                        <li>Squats - Legs</li>
                        <li>Deadlifts - Back</li>
                        <li>Curls - Biceps</li>
                        <li>Planks - Abs</li>
                    </ul>
                </div>

                <div className='nutrition-advice widget'>
                    <h3>Nutrition Advice</h3>
                    <p>Include protein-rich foods post-workout for muscle recovery. Stay hydrated!</p>
                </div>
            </div>
        </div>
    );
}

export default EnhancedWorkoutPlan;
