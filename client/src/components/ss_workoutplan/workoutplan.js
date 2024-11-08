import React, { useEffect, useState } from 'react';
import '../../App.css';
import './workoutplan.css';
import NavBar from "../navbar/nav_bar";
const WorkoutPlan = () => {

    const schedule = {
        sunday: { name: "Rest", exercises: [] },
        monday: { name: "Chest & Back", exercises: ["Bench Press", "Pull-Ups", "Cable Flys"] },
        tuesday: { name: "Arms", exercises: ["Bicep Curls", "Tricep Extensions", "Cable Pushdowns"] },
        wednesday: { name: "Legs", exercises: ["Squats", "Lunges", "Leg Press"] },
        thursday: { name: "Triceps", exercises: ["Skull Crushers", "Diamond Pushups"] },
        friday: { name: "Biceps", exercises: ["Curl", "Incline Curl"] },
        saturday: { name: "Rest", exercises: [] }
    };

    // Get today's day name
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const todayIndex = new Date().getDay();
    const todayName = dayNames[todayIndex];

    const updateCalendar = () => {
        dayNames.forEach((day, index) => {
            const dayElement = document.getElementById(day);
            if (index <= todayIndex) {
                dayElement.classList.add("disabled");
            }
            if (day === todayName) {
                dayElement.classList.remove("disabled");
                dayElement.classList.add("active");
                displayWorkout(day);
            }
        });
    }

    const displayWorkout = (day) => {
        const dayData = schedule[day];
        document.getElementById("dayDisplay").textContent = `Today: ${dayData.name}`;
        
        // Populate dropdown with exercises
        const dropdown = document.getElementById("exerciseDropdown");
        dropdown.innerHTML = "";
        if (dayData.exercises.length === 0) {
            dropdown.innerHTML = "<option>No exercises scheduled</option>";
        } else {
            dayData.exercises.forEach(exercise => {
                const option = document.createElement("option");
                option.textContent = exercise;
                dropdown.appendChild(option);
            });
        }
    }

    // Add event listeners for clickable days
    const addEventListener = () => {
        dayNames.forEach(day => {
            const dayElement = document.getElementById(day);
            dayElement.addEventListener("click", () => {
                if (!dayElement.classList.contains("disabled")) {
                    displayWorkout(day);
                }
            });
        });
    }
    
    updateCalendar();
    addEventListener();

    return (
        <>
            <NavBar />
            
            <div className='plan'>
                <div class="calendar-container">
                    <div class="day-container">
                        <div class="day-name">Sunday</div>
                        <div class="day disabled" id="sunday">Rest</div>
                    </div>
                    <div class="day-container">
                        <div class="day-name">Monday</div>
                        <div class="day disabled" id="monday">Chest & Back</div>
                    </div>
                    <div class="day-container">
                        <div class="day-name">Tuesday</div>
                        <div class="day disabled" id="tuesday">Arms</div>
                    </div>
                    <div class="day-container">
                        <div class="day-name">Wednesday</div>
                        <div class="day" id="wednesday">Legs</div>
                    </div>
                    <div class="day-container">
                        <div class="day-name">Thursday</div>
                        <div class="day" id="thursday">Rest</div>
                    </div>
                    <div class="day-container">
                        <div class="day-name">Friday</div>
                        <div class="day" id="friday">Biceps</div>
                    </div>
                    <div class="day-container">
                        <div class="day-name">Saturday</div>
                        <div class="day" id="saturday">Rest</div>
                    </div>
                </div>
                
                
                <div id="dayDisplay">Today: Legs</div>

                
                <select id="exerciseDropdown">
                    <option>Select an Exercise</option>
                </select>

                
                <a href="#" id="videoButton">Video Placeholder</a>
            </div>
        </>
        
    );
}

export default WorkoutPlan;
