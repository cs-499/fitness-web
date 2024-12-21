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
    const [budgetInput, setBudget] = useState('');
    const [spendingInput, setEnteredSpending] = useState('');
    const [graphTitle, setGraphTitle] = useState('');
    const [mockDate, setMockDate] = useState('');   // for debugging
    const [weekHistory, setWeekHistory] = useState([]);
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const [historySize, setHistorySize] = useState(0);
    const [currentWeekData, setCurrentWeekData] = useState([]);
    // spending below
    const [lastDateSpending, setLastDateSpending] = useState('')
    const [spendingThisWeek, setSpendingThisWeek] = useState([]);
    const [spendingHistory, setSpendingHistory] = useState([]);
    const [spendingThisWeekTotal, setSpendingThisWeekTotal] = useState(0);
    const [spendingThisMonth, setSpendingThisMonth] = useState(0);
    const [spendingThisYear, setSpendingThisYear] = useState(0);
    const [spendingTotal, setSpendingTotal] = useState(0);
    const [spendingGraphTitle, setspendingGraphTitle] = useState('');
    const [currentSpendingIndex, setCurrentSpendingIndex] = useState(0);

    useEffect(() => {
        document.title = 'Meal Plan Homepage';
    }, []);

    useEffect(() => {
        // setMockDate("2024-12-12T01:00:00.000Z");
        if (fetchCalorieGoal() && getCurrentCalories()){
            try {
                schedule();
            } catch (error) {
                console.error("Problem fetching inital data for calories");
            }
        }
    }, [mockDate]);

    useEffect(() => {
        getLocalWeekCal();
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

    useEffect(() => {
        if (fetchBudgetAndSpending()){
            try {
                spendingSchedule();
            } catch (error) {
                console.error("Problem fetching initial data for spending")
            }
        }
    }, []);

    useEffect(() => {
        if (spendingHistory.length > 0) {

        } else {
            renderSpendingGraph();
        }
    }, [spendingHistory, currentSpendingIndex]);

    // useEffect(() => {
    //     if (spendingGraphData.length > 0) {
    //         renderSpendingGraph(currentSpendingIndex);
    //     } else {
    //         renderSpendingGraph();
    //     }
    // }, [spendingGraphData, currentSpendingIndex]);

    const getCurrentDate = () => {
        return mockDate ? new Date(mockDate) : new Date();
    };

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
            setLastDate(response.data.date);
            // setLastDate(mockDate);

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
            const userId = localStorage.getItem('userId');
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
                const previousMonday = new Date(currentDateObj);
                previousMonday.setDate(previousMonday.getDate() - 6);
                const mondayDate = `${previousMonday.getMonth() + 1}/${previousMonday.getDate()}`;
            
                setWeekHistory(prev => [...prev, { [mondayDate]: previousWeek, userId }]);
                await resetWeek();
            } else if (dayName === "Monday" && currentDateObj > mondayBeginning && previousWeek.length === 7) {
                const previousMonday = new Date(currentDateObj);
                previousMonday.setDate(previousMonday.getDate() - 7);
                const mondayDate = `${previousMonday.getMonth() + 1}/${previousMonday.getDate()}`;
            
                setWeekHistory(prev => [...prev, { [mondayDate]: previousWeek, userId }]);
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

    const getLocalWeekCal = async () => {
        // load weekHistory from localStorage
        const storedHistory = localStorage.getItem('weekHistory');
        const userId = localStorage.getItem('userId');
    
        if (storedHistory && userId) {
            const parsedHistory = JSON.parse(storedHistory);
    
            // filter history for the current user
            const userSpecificHistory = parsedHistory.filter(entry => entry.userId === userId);
    
            // remove duplicates by date keys
            const uniqueHistory = [];
            const seenDates = new Set();
    
            userSpecificHistory.forEach(entry => {
                const dateKey = Object.keys(entry).find(key => key !== 'userId');
                if (dateKey && !seenDates.has(dateKey)) {
                    seenDates.add(dateKey);
                    uniqueHistory.push(entry);
                }
            });
    
            // sort the unique user's history based on the keys in MM/DD format
            const sortedHistory = uniqueHistory.sort((a, b) => {
                const keyA = Object.keys(a).find(key => key !== 'userId');
                const keyB = Object.keys(b).find(key => key !== 'userId');
    
                const [monthA, dayA] = keyA.split('/').map(Number);
                const [monthB, dayB] = keyB.split('/').map(Number);
    
                if (monthA !== monthB) {
                    return monthA - monthB;
                }
                return dayA - dayB;
            });
    
            setWeekHistory(sortedHistory);
            setCurrentWeekIndex(sortedHistory.length);
            setHistorySize(sortedHistory.length);
        } else if (!userId) {
            console.error("User ID not found in localStorage");
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

    const renderGraph = async (weekIndex = currentWeekIndex) => {
        setLoading(true);
    
        try {
            const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
            if (weekIndex < weekHistory.length && weekIndex >= 0) {
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

    // spending below
    const resetAllSpending = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        try {
            await axios.delete(`${process.env.REACT_APP_API_HOST}/meals/reset-spending-complete/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });
        } catch (error) {
            console.error("Problem deleting all spending: ", error);
        }
    };

    const fetchBudgetAndSpending = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_HOST}/meals/get-spending/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });
            if (response) {
                const { all_spending } = response.data;

                // parse spending goal values
                const lower = parseFloat(all_spending.spending_goal.lower_bound.$numberDecimal);
                const upper = parseFloat(all_spending.spending_goal.upper_bound.$numberDecimal);
                const storedBudget = parseFloat(all_spending.spending_goal.budget.$numberDecimal);

                // set the budget
                if (storedBudget > 0) {
                    setBudget(storedBudget.toFixed(2));
                    setIsBudgetLocked(true);
                } else if (lower > 0 && upper > 0) {
                    setBudget(`${lower.toFixed(2)} - ${upper.toFixed(2)}`);
                    setIsBudgetLocked(true);
                } else {
                    setBudget('');
                    setIsBudgetLocked(false);
                }

                // parse spending data
                const weeklySpending = all_spending.spending_this_week.map(entry => ({
                    ...entry,
                    amount: parseFloat(entry.amount.$numberDecimal),
                }));

                const weeklyTotal = weeklySpending.reduce((sum, entry) => sum + entry.amount, 0);
                if (all_spending.spending_this_week != []){
                    const lastUpdate = all_spending.spending_this_week.reduce((latest, current) => {
                        return new Date(current.dateUpdated) > new Date(latest.dateUpdated) ? current : latest;
                    });
                    setLastDateSpending(lastUpdate);
                } else {
                    const lastUpdate = '';
                    setLastDateSpending(lastUpdate);
                }

                setSpendingThisWeek(weeklySpending);
                setSpendingThisWeekTotal(weeklyTotal.toFixed(2));

                setSpendingThisMonth(parseFloat(all_spending.spending_this_month.$numberDecimal).toFixed(2));
                setSpendingThisYear(parseFloat(all_spending.spending_this_year.$numberDecimal).toFixed(2));
                setSpendingTotal(parseFloat(all_spending.spending_total_this_week.$numberDecimal).toFixed(2));

                console.log("Spending Data: ", all_spending);
                // console.log(spendingThisWeek);
            } else {
                console.log("No spending data available");
            }
        } catch (error) {
            console.error("Problem Getting Spending Goal: ", error);
        }

    };

    const handleSpendingSubmit = async () => {
        const spending = parseInt(spendingInput, 10);
    
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        const date = new Date();
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    
        try {
            await axios.post(`${process.env.REACT_APP_API_HOST}/meals/update-spending-this-week/${userId}`, 
                {day, spending, date},
                {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setEnteredSpending('');
            fetchBudgetAndSpending();
            window.location.reload();
        } catch (error) {
            console.error('Error submitting spending:', error);
            alert('An error occurred while updating spending');
        }
    };
    
    const handleBudgetSubmit = async () => {
        const budget = parseInt(budgetInput, 10);
    
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
        try {
            await axios.put(`${process.env.REACT_APP_API_HOST}/meals/update-budget/${userId}`,
                { budget },
                { 
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            // alert('Budget updated successfully');
            setIsBudgetLocked(true);
        } catch (err) {
            console.error('Error submitting budget:', err);
            // alert('An error occurred while updating the budget');
        }
    };
    
    const handleResetBudget = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
        if (!userId || !token) {
            console.error("User ID or token is missing.");
            return;
        }
    
        try {
            await axios.post(
                `${process.env.REACT_APP_API_HOST}/meals/reset-budget/${userId}`, 
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setIsBudgetLocked(false);
            setBudget('');
            fetchBudgetAndSpending();
            // console.log("Budget reset successfully.");
        } catch (error) {
            console.error('Error resetting budget:', error);
        }
    };

    const resetSpendingWeek = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
        try {
            await axios.delete(`${process.env.REACT_APP_API_HOST}/meals/reset-spending/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // console.log('Weekly spending data has been reset.');
        } catch (error) {
            console.error('Failed to reset weekly spending data:', error.response?.data || error.message);
            console.log('Failed to reset weekly spending data. Please try again.');
        }
    };

    const renderSpendingGraph = () => {
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        try {
            const formattedData = daysOfWeek.map(day => {
                const entry = spendingThisWeek.find(item => item.day === day);
                return entry ? entry.amount : 0;
            });
            setspendingGraphTitle("Spending This Week");
            setSpendingHistory(formattedData);
        } catch (error) {
            console.error("Error rendering spending graph data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigate = (searchType) => {
        if (searchType === "BASIC") {
            navigate(`/basicsearch`);
        } else if (searchType === "ADVANCED") {
            navigate(`/advancedsearch`);
        }
    };

    const spendingSchedule = async () => {
        try {
            const currentDateObj = getCurrentDate();        
            const dayName = currentDateObj.toLocaleDateString('en-US', { weekday: 'long' });
    
            const sundayEndOfDay = new Date(currentDateObj);
            sundayEndOfDay.setHours(23, 59, 59, 999);
    
            const mondayBeginning = new Date(currentDateObj);
            mondayBeginning.setHours(0, 0, 0, 1);
    
            if (
                (dayName === "Sunday" && currentDateObj > sundayEndOfDay) ||
                (dayName === "Monday" && currentDateObj < mondayBeginning)
            ) {
                if (spendingThisWeek.length > 0) {
                    const formattedDate = `${currentDateObj.getMonth() + 1}/${currentDateObj.getDate()}`;
    
                    const newHistoryEntry = {
                        date: formattedDate,
                        data: [...spendingThisWeek],
                    };
    
                    const updatedSpendingHistory = [...spendingHistory, newHistoryEntry];
    
                    const limitedAndSortedHistory = updatedSpendingHistory
                        .slice(-5)
                        .sort((a, b) => {
                            const [monthA, dayA] = a.date.split('/').map(Number);
                            const [monthB, dayB] = b.date.split('/').map(Number);
                            if (monthA !== monthB) {
                                return monthA - monthB;
                            }
                            return dayA - dayB;
                        });
    
                    setSpendingHistory(limitedAndSortedHistory);
    
                    resetSpendingWeek();
                    setSpendingThisWeek([]);
                }
            }
        } catch (error) {
            console.error("Error in spendingSchedule function:", error.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const spendingGraph = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [
            {
                label: 'Spending',
                data: spendingHistory,
                borderColor: 'rgba(54,162,235,1)',
                backgroundColor: 'rgba(54,162,235,0.2)',
                tension: 0.3,
                pointBackgroundColor: 'rgba(54,162,235,1)',
            },
            {
                label: 'Spending Goal',
                data: Array(7).fill(budgetInput),
                borderColor: 'rgba(255,0,0,1)',
                backgroundColor: 'rgba(255,0,0,0.2)',
                tension: 0.3,
                borderDash: [5, 5],
                pointBackgroundColor: 'rgba(255,0,0,1)',
            }
        ],
    };

    const spendingOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: spendingGraphTitle,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

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
                                    onKeyDown={ e => e.key === 'Enter' && handleCalorieSubmit()}
                                />
                                <button className='caloire-submit' onClick={handleCalorieSubmit}>Submit</button>
                            </div>
                            <div className='row2'>
                                <input 
                                    className='goal-input'
                                    placeholder='Enter Calorie Goal'
                                    value={calorieGoal}
                                    onChange={e => setCalorieGoal(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleGoalSubmit()}
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
                                        value={spendingInput}
                                        onChange={e => setEnteredSpending(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSpendingSubmit()}
                                    />
                                    <button className='caloire-submit' onClick={handleSpendingSubmit}>Submit</button>
                                </div>
                                <div className='row2'>
                                    <input 
                                        className='budget-input'
                                        placeholder='Enter Budget'
                                        value={budgetInput}
                                        onChange={e => setBudget(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleBudgetSubmit()}
                                        disabled={isBudgetLocked}
                                    />
                                    <button className='goal-submit' onClick={handleBudgetSubmit} disabled={isBudgetLocked}>Submit</button>
                                    <button className='reset-goal-button' onClick={handleResetBudget}></button>
                                </div>
                            </div>
                            <div className='spending-graph'>
                                <Line data={spendingGraph} options={spendingOptions} />
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default MealPlan;
