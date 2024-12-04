// Import necessary libraries and components
import React, { useEffect, useState } from 'react'; // React and hooks for state and side effects
import '../../App.css'; // Global CSS file
import './liveworkout.css'; // CSS file specific to the LiveWorkout component
import WorkoutImage from '../images/chest.png'; // Workout images for display
import WorkoutImage2 from '../images/legs.avif';
import WorkoutImage3 from '../images/biceps.webp';
import WorkoutImage4 from '../images/abs.jpg';
import NavBar from "../navbar/nav_bar"; // Navigation bar component
import ParticleSys from '../particles/particle_sys'; // Particle system for background effects

const LiveWorkout = () => {
    document.title = 'ShapeShifter'; // Set the document title for the browser tab

    // Workout data
    const images = [WorkoutImage, WorkoutImage2, WorkoutImage3, WorkoutImage4]; // Array of workout images
    const workoutNames = ["Chest", "Legs", "Biceps", "Abs"]; // Workout categories
    const exercises = { // Exercises data for each workout category
        Chest: [{ name: "Push-ups", sets: 3, reps: 10 }, { name: "Bench Press", sets: 4, reps: 8 }],
        Legs: [{ name: "Squats", sets: 4, reps: 12 }, { name: "Lunges", sets: 3, reps: 15 }],
        Biceps: [{ name: "Bicep Curls", sets: 3, reps: 12 }, { name: "Hammer Curls", sets: 4, reps: 10 }],
        Abs: [{ name: "Crunches", sets: 3, reps: 20 }, { name: "Planks", sets: 3, duration: 30 }]
    };

    // State variables
    const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0); // Tracks the current workout selection
    const [timeElapsed, setTimeElapsed] = useState(0); // Timer for workout session
    const [isPaused, setIsPaused] = useState(true); // Pause/resume state
    const [sessionDuration, setSessionDuration] = useState(2); // Workout session duration in minutes
    const [caloriesBurned, setCaloriesBurned] = useState(0); // Calories burned during the session
    const [caloriesHistory, setCaloriesHistory] = useState([]); // History of calories burned
    const [userWeight, setUserWeight] = useState(154); // User's weight in pounds
    const [caloricIntake, setCaloricIntake] = useState(2000); // Daily caloric goal
    const [caloriesConsumed, setCaloriesConsumed] = useState(0); // Calories consumed
    const [protein, setProtein] = useState(0); // Protein intake in grams
    const [carbs, setCarbs] = useState(0); // Carbohydrate intake in grams
    const [fat, setFat] = useState(0); // Fat intake in grams
    const [hydration, setHydration] = useState(0); // Hydration level in milliliters
    const [hydrationHistory, setHydrationHistory] = useState([]); // History of hydration levels
    const [heartRate, setHeartRate] = useState(80); // User's heart rate in bpm
    const [steps, setSteps] = useState(0); // Step count
    const [fitnessLevel, setFitnessLevel] = useState('Intermediate'); // User's fitness level
    const [mood, setMood] = useState('Neutral'); // User's mood
    const [motivation, setMotivation] = useState('Motivated'); // User's motivation level
    const [workoutType, setWorkoutType] = useState('Strength'); // Type of workout
    const [age, setAge] = useState(25); // User's age
    const [gender, setGender] = useState('Male'); // User's gender
    const [workoutHistory, setWorkoutHistory] = useState(JSON.parse(localStorage.getItem("workoutHistory")) || []); // History of completed workouts

    // Nutritional goals based on user weight
    const proteinGoal = (userWeight * 0.8).toFixed(1); // Protein goal in grams
    const carbGoal = (userWeight * 1.5).toFixed(1); // Carbohydrate goal in grams
    const fatGoal = (userWeight * 0.4).toFixed(1); // Fat goal in grams

    // Timer-related calculations
    const radius = 90; // Radius of the circular timer
    const circumference = 2 * Math.PI * radius; // Circumference of the circular timer
    const progress = ((timeElapsed % (sessionDuration * 60)) / (sessionDuration * 60)) * circumference; // Progress of the timer

    // Function to calculate calories burned based on MET, weight, and time
    const calculateCalories = (met, weight, timeMinutes) => ((met * 3.5 * weight * 0.453592) / 200) * timeMinutes;

    // Effect hook to manage the timer and update metrics periodically
    useEffect(() => {
        let interval;
        if (!isPaused) { // Run timer only if not paused
            interval = setInterval(() => {
                setTimeElapsed(prev => prev + 1); // Increment elapsed time
                if (timeElapsed % 30 === 0) { // Every 30 seconds, update metrics
                    const newCalories = calculateCalories(5, userWeight, 0.5); // Calculate calories burned
                    setCaloriesBurned(prevCalories => prevCalories + newCalories); // Update calories burned
                    setCaloriesHistory([...caloriesHistory, newCalories]); // Add to calorie history
                    setHeartRate(heartRate + Math.floor(Math.random() * 5)); // Simulate heart rate change
                    setSteps(steps + Math.floor(Math.random() * 10)); // Simulate step count
                }
            }, 1000); // Update every second
        }
        return () => clearInterval(interval); // Cleanup interval on pause or unmount
    }, [isPaused, timeElapsed]);

    // Toggle pause/resume state
    const togglePause = () => setIsPaused(!isPaused);

    // End workout session and save to history
    const endWorkout = () => {
        const workoutSummary = {
            date: new Date().toLocaleDateString(), // Current date
            timeElapsed: timeElapsed, // Total time elapsed
            caloriesBurned: caloriesBurned.toFixed(2), // Total calories burned
            hydration: hydration, // Total hydration
            steps: steps, // Total steps
            workoutType: workoutNames[currentWorkoutIndex] // Current workout type
        };
        const updatedHistory = [...workoutHistory, workoutSummary]; // Add summary to history
        setWorkoutHistory(updatedHistory); // Update state
        localStorage.setItem("workoutHistory", JSON.stringify(updatedHistory)); // Save to local storage
        
        // Reset session state
        setTimeElapsed(0);
        setCaloriesBurned(0);
        setHydration(0);
        setSteps(0);
        setIsPaused(true);
    };

    // Log a meal and update nutritional intake
    const logMeal = (calories, proteinAmount, carbsAmount, fatAmount) => {
        setCaloriesConsumed(caloriesConsumed + calories); // Update calories consumed
        setProtein(protein + proteinAmount); // Update protein intake
        setCarbs(carbs + carbsAmount); // Update carbohydrate intake
        setFat(fat + fatAmount); // Update fat intake
    };

    // Render the LiveWorkout component
    return (
        <div className="all">
            <NavBar /> {/* Navigation bar */}
            <div className="Workoutout_Meals">
                {/* Today's Workout Section */}
                <div className="todayW">
                    <h1 className="category_text">Today's Workout</h1>
                    <select
                        onChange={(e) => setCurrentWorkoutIndex(Number(e.target.value))} // Update workout index
                        value={currentWorkoutIndex}
                    >
                        {workoutNames.map((workout, index) => (
                            <option key={index} value={index}>
                                {workout} {/* Dropdown options for workout types */}
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

                {/* Guided Workout Section */}
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

                {/* Diet Tracker Section */}
                <div className="diet-tracker">
                    <h2>Diet Tracker</h2>
                    <p>Caloric Goal: {caloricIntake} kcal</p>
                    <p>Calories Consumed: {caloriesConsumed} kcal</p>
                    <p>Protein: {protein}g / {proteinGoal}g</p>
                    <p>Carbs: {carbs}g / {carbGoal}g</p>
                    <p>Fat: {fat}g / {fatGoal}g</p>
                    <button onClick={() => logMeal(500, 25, 60, 15)}>Log Meal</button> {/* Example log meal */}
                </div>

                {/* Circular Timer Section */}
                <div className="circular-timer">
                    <svg width="200" height="200">
                        <circle cx="100" cy="100" r={radius} fill="none" stroke="#e0e0e0" strokeWidth="10" /> {/* Background circle */}
                        <circle
                            cx="100"
                            cy="100"
                            r={radius}
                            fill="none"
                            stroke="#007bff"
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference - progress} // Progress circle
                        />
                    </svg>
                    <div className="timer-text">
                        {Math.floor(timeElapsed / 60)}:{String(timeElapsed % 60).padStart(2, '0')} {/* Timer display */}
                    </div>
                    <div className="timer-controls">
                        <button onClick={togglePause}>{isPaused ? "Resume" : "Pause"}</button> {/* Pause/resume button */}
                        <button onClick={endWorkout}>Reset</button> {/* Reset button */}
                    </div>
                </div>

                {/* Complete Workout Button */}
                <button className="done-button" onClick={endWorkout}>
                    Complete Workout
                </button>
            </div>
            <ParticleSys /> {/* Background particle system */}
        </div>
    );
};

export default LiveWorkout; // Export the component
