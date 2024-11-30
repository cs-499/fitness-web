import React, { useEffect, useState } from 'react';
import '../../App.css';
import './liveworkout.css';
import WorkoutImage from '../images/chest.png';
import WorkoutImage2 from '../images/legs.avif';
import WorkoutImage3 from '../images/biceps.webp';
import WorkoutImage4 from '../images/abs.jpg';
import NavBar from "../navbar/nav_bar";
import ParticleSys from '../particles/particle_sys';

const LiveWorkout = () => {
    document.title = 'ShapeShifter';

    const images = [WorkoutImage, WorkoutImage2, WorkoutImage3, WorkoutImage4];
    const workoutNames = ["Chest", "Legs", "Biceps", "Abs"];
    const exercises = {
        Chest: [{ name: "Push-ups", sets: 3, reps: 10 }, { name: "Bench Press", sets: 4, reps: 8 }],
        Legs: [{ name: "Squats", sets: 4, reps: 12 }, { name: "Lunges", sets: 3, reps: 15 }],
        Biceps: [{ name: "Bicep Curls", sets: 3, reps: 12 }, { name: "Hammer Curls", sets: 4, reps: 10 }],
        Abs: [{ name: "Crunches", sets: 3, reps: 20 }, { name: "Planks", sets: 3, duration: 30 }]
    };

    const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isPaused, setIsPaused] = useState(true);
    const [sessionDuration, setSessionDuration] = useState(2);
    const [timeLeft, setTimeLeft] = useState(sessionDuration * 60);
    const [caloriesBurned, setCaloriesBurned] = useState(0);
    const [caloriesHistory, setCaloriesHistory] = useState([]);
    const [userWeight, setUserWeight] = useState(154);
    const [caloricIntake, setCaloricIntake] = useState(2000);
    const [caloriesConsumed, setCaloriesConsumed] = useState(0);
    const [protein, setProtein] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [fat, setFat] = useState(0);
    const [hydration, setHydration] = useState(0);
    const [hydrationHistory, setHydrationHistory] = useState([]);
    const [heartRate, setHeartRate] = useState(80);
    const [steps, setSteps] = useState(0);
    const [fitnessLevel, setFitnessLevel] = useState('Intermediate');
    const [mood, setMood] = useState('Neutral');
    const [motivation, setMotivation] = useState('Motivated');
    const [workoutType, setWorkoutType] = useState('Strength');
    const [age, setAge] = useState(25);
    const [gender, setGender] = useState('Male');
    const [workoutHistory, setWorkoutHistory] = useState(JSON.parse(localStorage.getItem("workoutHistory")) || []);

    const proteinGoal = (userWeight * 0.8).toFixed(1);
    const carbGoal = (userWeight * 1.5).toFixed(1);
    const fatGoal = (userWeight * 0.4).toFixed(1);

    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const progress = ((timeElapsed % (sessionDuration * 60)) / (sessionDuration * 60)) * circumference;

    const calculateCalories = (met, weight, timeMinutes) => ((met * 3.5 * weight * 0.453592) / 200) * timeMinutes;

    useEffect(() => {
        let interval;
        if (!isPaused) {
            interval = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
                if (timeElapsed % 30 === 0) {
                    const newCalories = calculateCalories(5, userWeight, 0.5);
                    setCaloriesBurned(prevCalories => prevCalories + newCalories);
                    setCaloriesHistory([...caloriesHistory, newCalories]);
                    setHeartRate(heartRate + Math.floor(Math.random() * 5));
                    setSteps(steps + Math.floor(Math.random() * 10));
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPaused, timeElapsed]);

    const togglePause = () => setIsPaused(!isPaused);

    const endWorkout = () => {
        const workoutSummary = {
            date: new Date().toLocaleDateString(),
            timeElapsed: timeElapsed,
            caloriesBurned: caloriesBurned.toFixed(2),
            hydration: hydration,
            steps: steps,
            workoutType: workoutNames[currentWorkoutIndex]
        };
        const updatedHistory = [...workoutHistory, workoutSummary];
        setWorkoutHistory(updatedHistory);
        localStorage.setItem("workoutHistory", JSON.stringify(updatedHistory));
        
        setTimeElapsed(0);
        setCaloriesBurned(0);
        setHydration(0);
        setSteps(0);
        setIsPaused(true);
    };

    const logMeal = (calories, proteinAmount, carbsAmount, fatAmount) => {
        setCaloriesConsumed(caloriesConsumed + calories);
        setProtein(protein + proteinAmount);
        setCarbs(carbs + carbsAmount);
        setFat(fat + fatAmount);
    };

    return (
<div className="all">
    <NavBar />
    <div className="Workoutout_Meals">
        {/* Today's Workout Section */}
        <div className="todayW">
            <h1 className="category_text">Today's Workout</h1>
            <select
                onChange={(e) => setCurrentWorkoutIndex(Number(e.target.value))}
                value={currentWorkoutIndex}
            >
                {workoutNames.map((workout, index) => (
                    <option key={index} value={index}>
                        {workout}
                    </option>
                ))}
            </select>

            {/* Metrics Display */}
            <div className="metrics-display">
                <h2>Calories Burned: {caloriesBurned.toFixed(2)}</h2>
                <h3>Hydration: {hydration} ml</h3>
                <h3>Heart Rate: {heartRate} bpm</h3>
            </div>
        </div>

        {/* Guided Workout */}
        <div className="guided-workout">
            <h2>Guided Workout for {workoutNames[currentWorkoutIndex]}</h2>
            <ul>
                {exercises[workoutNames[currentWorkoutIndex]].map((exercise, index) => (
                    <li key={index}>
                        {exercise.name} - {exercise.sets} Sets of {exercise.reps || `${exercise.duration}s`} Reps
                    </li>
                ))}
            </ul>
        </div>

        {/* Diet Tracker */}
        <div className="diet-tracker">
            <h2>Diet Tracker</h2>
            <p>Caloric Goal: {caloricIntake} kcal</p>
            <p>Calories Consumed: {caloriesConsumed} kcal</p>
            <p>Protein: {protein}g / {proteinGoal}g</p>
            <p>Carbs: {carbs}g / {carbGoal}g</p>
            <p>Fat: {fat}g / {fatGoal}g</p>
            <button onClick={() => logMeal(500, 25, 60, 15)}>Log Meal</button>
        </div>

        {/* Circular Timer */}
        <div className="circular-timer">
            <svg width="200" height="200">
                <circle cx="100" cy="100" r={radius} fill="none" stroke="#e0e0e0" strokeWidth="10" />
                <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke="#007bff"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                />
            </svg>
            <div className="timer-text">
                {Math.floor(timeElapsed / 60)}:{String(timeElapsed % 60).padStart(2, '0')}
            </div>
            <div className="timer-controls">
                <button onClick={togglePause}>{isPaused ? "Resume" : "Pause"}</button>
                <button onClick={endWorkout}>Reset</button>
            </div>
        </div>

        {/* Complete Workout */}
        <button className="done-button" onClick={endWorkout}>
            Complete Workout
        </button>
    </div>
    <ParticleSys />
</div>



    );
};

export default LiveWorkout;
