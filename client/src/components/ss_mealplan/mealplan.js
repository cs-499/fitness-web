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
    const [weekCalories, setGraphData] = useState([]);
    const [isGoalLocked, setIsGoalLocked] = useState(false);
    const [isBudgetLocked, setIsBudgetLocked] = useState(false);
    const [currentCalories, setCurrent] = useState(0);
    const [lastDate, setLastDate] = useState('');
    const [budget, setBudget] = useState('');
    const [spending, setEnteredSpending] = useState('');
    const [graphTitle, setGraphTitle] = useState('');
    const [mockDate, setMockDate] = useState('');   // for debugging
    const [weekHistory, setWeekHistory] = useState([]);
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [historySize, setHistorySize] = useState(0);
    const [currentWeekData, setCurrentWeekData] = useState([]);

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
        setMockDate("2024-12-16T01:00:00.000Z");
        if (fetchCalorieGoal() && getCurrentCalories()){
            try {
                schedule();
            // // fetch current goal
            // fetchCalorieGoal();
            // // fetch current calories
            // getCurrentCalories();
            } catch (error) {
                console.error("Problem fetching inital data");
            }
        }
    }, [mockDate]);

    const getCurrentDate = () => {
        return mockDate ? new Date(mockDate) : new Date();
    };  // function for debugging

    useEffect(() => {
        console.log(currentCalories, lastDate);
    }, [currentCalories, lastDate]);

    useEffect(() => {
        // load weekHistory from localStorage
        const storedHistory = localStorage.getItem('weekHistory');
        if (storedHistory) {
            const parsedHistory = JSON.parse(storedHistory);
            setWeekHistory(parsedHistory);
    
            setCurrentWeekIndex(parsedHistory.length);
            setHistorySize(parsedHistory.length);
        }
    }, []);
    
    useEffect(() => {
        // save weekHistory to localStorage on update
        if (weekHistory.length > 0) {
            localStorage.setItem('weekHistory', JSON.stringify(weekHistory));
        }
    }, [weekHistory]);

    useEffect(() => {
        if (weekHistory.length > 0) {
            renderGraph(currentWeekIndex);
        } else {
            renderGraph();
        }
    }, [weekHistory, currentWeekIndex]);

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

    const handlePreviousWeek = async () => {
        if (currentWeekIndex === historySize) {
            const weekData = await getWeek();
            setCurrentWeekData(weekData);
        }
        if (currentWeekIndex > 0) {
            const newIndex = currentWeekIndex - 1;
            setCurrentWeekIndex(newIndex);
            renderGraph(newIndex);
        }
    };
    
    const handleNextWeek = async () => {
        const newIndex = currentWeekIndex + 1;
        setCurrentWeekIndex(newIndex);
        if (currentWeekIndex === historySize){
            renderGraph(currentWeekData);
        } else {
            renderGraph(newIndex);
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
        const date = getCurrentDate().toISOString();
    
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
            await getCurrentCalories();
            window.location.reload();
            // console.log("current calories set: ", currentCalories);
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

            setCurrent(response.data.current_calories);
            // setLastDate(response.data.date);
            setLastDate(mockDate);

            // console.log("current calories: ", response.data.current_calories);
            // console.log("date of last entry: ", response.data.date);
        } catch (error){
            console.error("Could not retrieve current calories", error.message);
        }
    };

    const resetCalories = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
        try {
            await axios.put(`${process.env.REACT_APP_API_HOST}/meals/reset-current-calories/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // console.log("Calories reset:", response.data);
        } catch (error) {
            console.error("Error resetting calories:", error.message);
        }
    };

    const schedule = async () => {
        try {
            // 1: get current and last entry dates
            const currentDateObj = getCurrentDate(); // current date
            const currentDate = currentDateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
    
            // ensure the current calories and last date are fetched
            // await getCurrentCalories();
            const lastEntryDate = lastDate ? lastDate.split('T')[0] : '';
            // 2: format day name
            const dayName = currentDateObj.toLocaleDateString('en-US', { weekday: 'long' });
            
            const sundayEndOfDay = new Date(currentDateObj);
            sundayEndOfDay.setHours(23, 59, 59, 999);    // last second of sunday
            const mondayBeginning = new Date(currentDateObj);
            mondayBeginning.setHours(0, 0, 0, 1);   // first second of monday

            // console.log("THIS: ", currentDate, dayName);
            // console.log("WEEK HISTORY: ", weekHistory);

            const previousWeek = await getWeek();

            if (dayName === "Sunday" && currentDateObj > sundayEndOfDay && previousWeek.length === 7) {            
                // date of the Monday of the previous week
                const previousMonday = new Date(currentDateObj);
                previousMonday.setDate(previousMonday.getDate() - 6); // Move back 6 days from Sunday
                const mondayDate = `${previousMonday.getMonth() + 1}/${previousMonday.getDate()}`; // Format MM/DD
            
                setWeekHistory(prev => [...prev, { [mondayDate]: previousWeek }]);
                await resetWeek();
            } else if (dayName === "Monday" && currentDateObj > mondayBeginning && previousWeek.length === 7) {
                // console.log("THIS");
                // date of the Monday of the previous week
                const previousMonday = new Date(currentDateObj);
                previousMonday.setDate(previousMonday.getDate() - 7); // Move back 7 days from Monday
                const mondayDate = `${previousMonday.getMonth() + 1}/${previousMonday.getDate()}`; // Format MM/DD
            
                setWeekHistory(prev => [...prev, { [mondayDate]: previousWeek }]);
                await resetWeek();
            }
            
            // console.error("current date", currentDate, "last entry date", lastEntryDate);
            // check if the current date matches the last entry date
            if (currentDate !== lastEntryDate && lastEntryDate !== " ") {
                // console.error("current date", currentDate, "last entry date", lastEntryDate);
                // console.log("current date", currentDate, "last entry date", lastEntryDate);
                // console.log("New day detected. Updating calories for the previous day.");
    
                // 3: update calories_this_week with the last entry's data
                // await axios.post(`${process.env.REACT_APP_API_HOST}/meals/update-calories-this-week/${userId}`,
                //     { day: dayName, amount: currentCalories, date: lastDate },
                //     {
                //         headers: {
                //             'Content-Type': 'application/json',
                //             'Authorization': `Bearer ${token}`,
                //         },
                //     }
                // );
    
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

    const renderGraph = async (weekIndex = currentWeekIndex, weekDataInput = null) => {
        setLoading(true);
    
        try {
            const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
            if (weekDataInput) {
                const formattedData = daysOfWeek.map(day => {
                    const entry = weekDataInput.find(item => item.day === day);
                    return entry ? entry.amount : 0;
                });
    
                setGraphData(formattedData);
            } else if (weekIndex < weekHistory.length && weekIndex >= 0) {
                const weekKey = Object.keys(weekHistory[weekIndex])[0];
                const weekData = weekHistory[weekIndex][weekKey];
    
                setGraphTitle(`Calorie Consumption From ${weekKey}`);
                const formattedData = daysOfWeek.map(day => {
                    const entry = weekData.find(item => item.day === day);
                    return entry ? entry.amount : 0;
                });
    
                setGraphData(formattedData);
            } else {
                const weekData = await getWeek();
                const formattedData = daysOfWeek.map(day => {
                    const entry = weekData.find(item => item.day === day);
                    return entry ? entry.amount : 0;
                });
    
                setGraphData(formattedData);
                setGraphTitle("Calories Consumed This Week");
            }
        } catch (error) {
            console.error("Error rendering graph data:", error);
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
                        <div className="week-navigation">
                            <button
                                onClick={handlePreviousWeek}
                                className="prev-week"
                                disabled={currentWeekIndex <= 0}
                            >
                                Previous Week
                            </button>
                            <button
                                onClick={handleNextWeek}
                                className="next-week"
                                disabled={currentWeekIndex >= weekHistory.length}
                            >
                                Next Week
                            </button>
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
