import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';
import './mealplan.css';
import NavBar from "../navbar/nav_bar";
import { useNavigate } from 'react-router-dom';

// graphing
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// registering Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Main functional component for setting meal plan goals
const MealPlan = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState();
    const [error, setError] = useState('');
    const [calorieGoal, setCalorieGoal] = useState('');
    const [enteredCalories, setEnteredCalories] = useState('');
    const [weekCalories, setWeekCalories] = useState([]);
    const [isGoalLocked, setIsGoalLocked] = useState(false);
    const [isBudgetLocked, setIsBudgetLocked] = useState(false);
    const [currentCalories, setCurrent] = useState(0);
    const [lastDate, setLastDate] = useState('');
    const [budget, setBudget] = useState('');
    const [spending, setEnteredSpending] = useState('');
    const [graphTitle, setGraphTitle] = useState('');
    // const [mockDate, setMockDate] = useState('');   // for debugging

    useEffect(() => {
        document.title = 'Meal Plan Homepage';
        
        /* 
        const printAll = async () => {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${process.env.REACT_APP_API_HOST}/survey/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                let surveyResponses = await response.json();
                
                surveyResponses = surveyResponses.map(survey => ({
                    ...survey,
                    answers: Object.fromEntries(
                        Object.entries(survey.answers).filter(([question, details]) => details.questionTarget === 'workout')
                    )
                }));
                console.log("Response: ", surveyResponses);
            } catch (error) {
                console.error("Error retrieving survey: ", error);
            }
        }
        printAll();
        */
    }, []);

    useEffect(() => {
        // fetch current goal
        fetchCalorieGoal();
    }, []);

    useEffect(() => {
        getCurrentCalories();
        // scheduled event for daily/weekly change
        schedule();
        // getWeek();
        // resetWeek();
        // setMockDate("2024-12-14T00:00:00.000Z");
    }, []);

    // const getCurrentDate = () => {
    //     return mockDate ? new Date(mockDate) : new Date();
    // };  // function for debugging

    useEffect(() => {
        if (currentCalories != 0){
            console.log(currentCalories, lastDate);
        }
    }, [currentCalories, lastDate]);

    useEffect(() => {
        getWeekData();

        // graph title
        const currentDate = new Date();
        const currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
        if (currentDay === 'Monday') {
            setGraphTitle('Calories Consumed Last Week');
        } else {
            setGraphTitle('Calories Consumed This Week');
        }
    }, []);

    const fetchCalorieGoal = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_HOST}/meals/calorie-goal/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // console.log("calorie goal: ", response.data.calorieGoal);
            if (response.data.calorieGoal === 0) {
                return;
            } else {
                setCalorieGoal(response.data.calorieGoal);
                setIsGoalLocked(true); // lock the input if a goal is already set
                setLoading(false);
            }
        } catch (error) {
            console.error('Failed to fetch calorie goal:', error);
            setError('Failed to fetch calorie goal');
            setLoading(false);
        }
    };

    const handleGoalSubmit = async () => {
        if (!calorieGoal || isNaN(calorieGoal)) {
            alert('Please enter a valid number for calorie goal.');
            return;
        }
        setLoading(true);
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${process.env.REACT_APP_API_HOST}/meals/update-calorie-goal/${userId}`,
                { newCalorieGoal: calorieGoal },
                { 
                    headers: { 'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json' } 
                }
            );
            setIsGoalLocked(true);
            setLoading(false);
        } catch (error) {
            console.error('Failed to update calorie goal:', error.response ? error.response.data : error);
            setError('Failed to update calorie goal');
            setLoading(false);
        }
    };
    
    const handleResetGoal = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${process.env.REACT_APP_API_HOST}/meals/update-calorie-goal/${userId}`, 
                { newCalorieGoal: 0 },
                { 
                    headers: { 'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json' } 
                }
            );
            setCalorieGoal('');
            setIsGoalLocked(false);
            setLoading(false);
        } catch (error) {
            console.error('Failed to reset calorie goal:', error.response ? error.response.data : error);
            setError('Failed to reset calorie goal');
            setLoading(false);
        }
    };

    const handleCalorieSubmit = async () => {
        const calories = parseInt(enteredCalories, 10);
    
        if (!calories || isNaN(calories)) {
            alert('Please enter a valid number for current calories.');
            return;
        }
    
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        const date = new Date().toISOString();
        // const date = mockDate;
    
        try {
            await axios.put(`${process.env.REACT_APP_API_HOST}/meals/update-current-calories/${userId}`,
                { calories, date },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            setEnteredCalories('');
            getCurrentCalories();
        } catch (error) {
            console.error('Error updating current calories:', error.response?.data || error.message);
        }
    };

    const getCurrentCalories = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_HOST}/meals/get-current-calories/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setCurrent(response.data.currentCalories);
            setLastDate(response.data.date);

            // console.log("current calories: ", currentCalories);
            // console.log("date of last entry: ", lastDate);
        } catch (error){
            console.error("Could not retrieve current calories", error.message);
        }
    };

    const resetCalories = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_HOST}/meals/reset-current-calories/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // console.log("Calories reset:", response.data);
        } catch (error) {
            console.error("Error resetting calories:", error.message);
        }
    };

    const schedule = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
        try {
            // 1: get current and last entry dates
            const currentDateObj = new Date(); // current date
            // const currentDate = getCurrentDate();
            const currentDate = currentDateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
    
            // ensure the current calories and last date are fetched
            await getCurrentCalories();
            const lastEntryDate = lastDate ? lastDate.split('T')[0] : '';
            // 2: format day name
            // const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
            const dayName = currentDateObj.toLocaleDateString('en-US', { weekday: 'long' });
            
            if (dayName === 'Monday') {
                // console.log("Today is Monday. Resetting last week's data.");
                await resetWeek();
            }
    
            // check if the current date matches the last entry date
            if (currentDate !== lastEntryDate) {
                // console.log("New day detected. Updating calories for the previous day.");
    
                // 3: update calories_this_week with the last entry's data
                await axios.post(`${process.env.REACT_APP_API_HOST}/meals/update-calories-this-week/${userId}`,
                    { day: dayName, amount: currentCalories, date: lastDate },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
    
                // console.log("Updated calories_this_week with the last entry's data.");
    
                // 4: reset current calories to 0 for the new day
                resetCalories();
    
                // console.log("Reset current calories to 0 for the new day.");
            } else {
                console.log("No update needed. Dates match.");
            }
        } catch (error) {
            console.error("Error in schedule function:", error.message);
        }
    };

    const getWeek = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_HOST}/meals/get-calories-this-week/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // console.log(response.data.data);
            return response.data.data;
        } catch (error){
            console.error("Error getting calories this week: ", error);
        };
    };

    const getWeekData = async () => {
        setLoading(true);
    
        try {
            const weekData = await getWeek();
            console.log(weekData);
    
            // map the week data to ensure all days (Monday to Sunday) are represented
            const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const formattedData = daysOfWeek.map(day => {
                const entry = weekData.find(item => item.day === day);
                return entry ? entry.amount : 0; // default amount to 0 if no entry exists for the day
            });
    
            setWeekCalories(formattedData);
        } catch (error) {
            console.error("Error getting calories this week:", error);
        } finally {
            setLoading(false);
        }
    };

    const resetWeek = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
        try {
            await axios.delete(`${process.env.REACT_APP_API_HOST}/meals/reset-week/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // console.log('Weekly data has been reset.');
        } catch (error) {
            console.error('Failed to reset weekly data:', error.response?.data || error.message);
            console.log('Failed to reset weekly data. Please try again.');
        }
    };

    const handleSpendingSubmit = async () => {
        const spent = parseInt(spending, 10);
    
        if (!spent || isNaN(spent)) {
            alert('Please enter a valid amount spent');
            return;
        }
    
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        const date = new Date().toISOString();
    
    };

    const handleBudgetSubmit = async () => {

    };

    const handleResetBudget = async () => {

    };

    const handleNavigate = (searchType) => {
        if (searchType === "BASIC") {
            navigate(`/basicsearch`);
        } else if (searchType === "ADVANCED") {
            navigate(`/advancedsearch`);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const data = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [
            {
                label: 'Calories Consumed',
                data: weekCalories,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                tension: 0.3,
                pointBackgroundColor: 'rgba(75,192,192,1)',
            },
            {
                label: 'Calorie Goal',
                data: Array(7).fill(calorieGoal),
                borderColor: 'rgba(255,0,0,1)',
                backgroundColor: 'rgba(255,0,0,0.2)',
                tension: 0.3,
                borderDash: [5, 5],
                pointBackgroundColor: 'rgba(255,0,0,1)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: graphTitle,
                color: graphTitle.includes('Last Week') ? 'blue' : 'black', // Highlight "Last Week" in blue
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className='mealplan'>
            <NavBar />
            <div className='meal-interface'>
                <div className="navigate-container">
                    <button className='BASIC' onClick={() => handleNavigate("BASIC")}>
                        Basic Search
                    </button>
                    <button className='ADVANCED' onClick={() => handleNavigate("ADVANCED")}>
                        Advanced Search
                    </button>
                </div>
                <div className="container">
                    <div className='left-container'>
                        <div className='calorie-tracker'>
                            <div className='row1'>
                                <input 
                                    className='calorie-input'
                                    placeholder='Enter Recent Calories'
                                    value={enteredCalories}
                                    onChange={e => setEnteredCalories(e.target.value)}
                                />
                                <button className='caloire-submit' onClick={handleCalorieSubmit}>Submit</button>
                            </div>
                            <div className='row2'>
                                <input 
                                    className='goal-input'
                                    placeholder='Enter Calorie Goal'
                                    value={calorieGoal}
                                    onChange={e => setCalorieGoal(e.target.value)}
                                    disabled={isGoalLocked}
                                />
                                <button className='goal-submit' onClick={handleGoalSubmit} disabled={isGoalLocked}>Submit</button>
                                <button className='reset-goal-button' onClick={handleResetGoal}></button>
                            </div>
                        </div>
                        <div className='calorie-graph'>
                            <Line data={data} options={options} />
                        </div>
                    </div>
                    <div className='right-container'>
                        <div className='spending-tracker'>
                                <div className='row1'>
                                    <input 
                                        className='spending-input'
                                        placeholder='Enter Recent Spending'
                                        value={spending}
                                        onChange={e => setEnteredSpending(e.target.value)}
                                    />
                                    <button className='caloire-submit' onClick={handleSpendingSubmit}>Submit</button>
                                </div>
                                <div className='row2'>
                                    <input 
                                        className='budget-input'
                                        placeholder='Enter Budget'
                                        value={budget}
                                        onChange={e => setBudget(e.target.value)}
                                        disabled={isBudgetLocked}
                                    />
                                    <button className='goal-submit' onClick={handleBudgetSubmit} disabled={isBudgetLocked}>Submit</button>
                                    <button className='reset-goal-button' onClick={handleResetBudget}></button>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default MealPlan;
