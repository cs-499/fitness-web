import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';
import './mealplan.css';
import NavBar from "../navbar/nav_bar";
import { useNavigate } from 'react-router-dom';

// graphing
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// registering Chart.js components
ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend );

// Main functional component for setting meal plan goals
const MealPlan = () => {
    const navigate = useNavigate();
    // states below
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [mockDate, setMockDate] = useState('');   // for debugging
    // calorie data
    const [calorieGoal, setCalorieGoal] = useState({goal: '', locked: false});
    const [caloriesEntered, setCaloriesEntered] = useState({amount: "", date: ""});
    const [currentCalories, setCurrentCalories] = useState({current: 0, date: ""});
    const [calorieWeekHistory, setCalorieWeekHistory] = useState([]);
    const [calorieHistorySize, setCalorieHistorySize] = useState(0);
    const [calorieHistoryIndex, setCalorieGraphIndex] = useState(0);

    // spending data
    const [budget, setBudget] = useState({goal: '', locked: false});
    const [spendingEntered, setSpendingEntered] = useState({amount: "", date: ""});
    // eslint-disable-next-line no-unused-vars
    const [lastDateSpending, setLastDateSpending] = useState('');
    const [spendingThisWeek, setSpendingThisWeek] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [spendingMonthTotal, setSpendingMonthTotal] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [spendingYearTotal, setSpendingYearTotal] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [spendingTotal, setSpendingTotal] = useState(0);
    const [spendingHistoryIndex, setSpendingHistoryIndex] = useState(0);
    const [spendingHistory, setSpendingHistory] = useState([]);

    // calorie graph
    const [calorieGraphTitle, setClaorieGraphTitle] = useState('');
    const [calorieGraphData, setCalorieGraphData] = useState([]);
    // spending graph
    const [spendingGraphTitle, setSpendingGraphTitle] = useState('');
    const [spendingGraphData, setSpendingGraphData] = useState([]);

    // functions below

    // gets week history from local storage
    const getLocalWeekCal = async () => {
        // load weekHistory from localStorage
        const userId = localStorage.getItem('userId');
        const storedHistory = localStorage.getItem(`${userId}_WeekHistory`);
    
        if (storedHistory && userId) {
            const parsedHistory = JSON.parse(storedHistory);
    
            // sort the user's history based on the keys in MM/DD format
            const sortedHistory = parsedHistory.sort((a, b) => {    
                const keyA = Object.keys(a).find(key => key !== 'userId');
                const keyB = Object.keys(b).find(key => key !== 'userId');
                const [monthA, dayA] = keyA.split('/').map(Number);
                const [monthB, dayB] = keyB.split('/').map(Number);
    
                if (monthA !== monthB) {
                    return monthA - monthB;
                }
                return dayA - dayB;
            });
    
            setCalorieWeekHistory(sortedHistory);
            setCalorieGraphIndex(sortedHistory.length);
            setCalorieHistorySize(sortedHistory.length);
        } else if (!userId) {
            console.error("User ID not found in localStorage");
        }
    };

    // gets calorie goal, sets lock if established
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
                setCalorieGoal({goal: response.data.calorieGoal, locked: true}); // lock the input if a goal is already set
            }
        } catch (error) {
            console.error('Failed to fetch calorie goal:', error);
        }
    };

    // gets user's current calories
    const getCurrentCalories = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_HOST}/meals/get-current-calories/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const date = response.data.date.toString;
            setCurrentCalories({current: response.data.current_calories, date: date});

        } catch (error){
            console.error("Could not retrieve current calories", error.message);
        }
    };

    // scheduled function
    const calorieSchedule = async () => {
        try {
            const userId = localStorage.getItem('userId');
            // 1: get current and last entry dates
            const currentDateObj = getCurrentDate(); // current date
            const currentDate = currentDateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
    
            // ensure the current calories and last date are fetched
            // await getCurrentCalories();
            const lastEntryDate = currentCalories.date ? currentCalories.date.split('T')[0] : '';
            // 2: format day name
            const dayName = currentDateObj.toLocaleDateString('en-US', { weekday: 'long' });
            
            const sundayEndOfDay = new Date(currentDateObj);
            sundayEndOfDay.setHours(23, 59, 59, 999);    // last second of sunday
            const mondayBeginning = new Date(currentDateObj);
            mondayBeginning.setHours(0, 0, 0, 1);   // first second of monday

            const previousWeek = await getWeek();

            if (dayName === "Sunday" && currentDateObj > sundayEndOfDay && previousWeek.length === 7) {            
                const previousMonday = new Date(currentDateObj);
                previousMonday.setDate(previousMonday.getDate() - 6);
                const mondayDate = `${previousMonday.getMonth() + 1}/${previousMonday.getDate()}`;
            
                setCalorieWeekHistory(prev => [...prev, { [mondayDate]: previousWeek, userId }]);
                await resetWeek();
            } else if (dayName === "Monday" && currentDateObj > mondayBeginning && previousWeek.length === 7) {
                const previousMonday = new Date(currentDateObj);
                previousMonday.setDate(previousMonday.getDate() - 7);
                const mondayDate = `${previousMonday.getMonth() + 1}/${previousMonday.getDate()}`;
            
                setCalorieWeekHistory(prev => [...prev, { [mondayDate]: previousWeek, userId }]);
                await resetWeek();
            }

            if (currentDate !== lastEntryDate && lastEntryDate !== " ") {
                resetCalories();
    
            } else {
                console.log("No update needed. Dates match.");
            }
        } catch (error) {
            console.error("Error in schedule function:", error.message);
        }
    };

    // fetches an array of calorie entries throughout the current week
    const getWeek = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_HOST}/meals/get-calories-this-week/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.data;
        } catch (error){
            console.error("Error getting calories this week: ", error);
        };
    };

    // resets calories this week
    const resetWeek = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
        try {
            await axios.delete(`${process.env.REACT_APP_API_HOST}/meals/reset-week/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Failed to reset weekly data:', error.response?.data || error.message);
            console.log('Failed to reset weekly data. Please try again.');
        }
    };

    // resets current calories
    const resetCalories = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
        try {
            await axios.put(`${process.env.REACT_APP_API_HOST}/meals/reset-current-calories/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Error resetting calories:", error.message);
        }
    };

    // fetches all spending details
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
                // parse decimal values to floats
                const budget = parseFloat(all_spending.spending_goal.budget.$numberDecimal);
                const weeklyTotal = parseFloat(all_spending.spending_total_this_week.$numberDecimal);
                const monthlyTotal = parseFloat(all_spending.spending_this_month.$numberDecimal);
                const yearlyTotal = parseFloat(all_spending.spending_this_year.$numberDecimal);
    
                // convert each spending_this_week entry to a usable format
                const weeklySpending = all_spending.spending_this_week.map(entry => ({
                    day: entry.day,
                    amount: parseFloat(entry.amount.$numberDecimal),
                    dateUpdated: new Date(entry.dateUpdated),
                    _id: entry._id
                }));
    
                // update the states
                setBudget({ goal: budget.toFixed(2), locked: budget > 0 });
                setSpendingThisWeek(weeklySpending);
                setSpendingTotal(weeklyTotal.toFixed(2));
                setSpendingMonthTotal(monthlyTotal.toFixed(2));
                setSpendingYearTotal(yearlyTotal.toFixed(2));
    
                renderSpendingGraph();
            } else {
                console.log("No spending data available");
            }
        } catch (error) {
            console.error("Problem Getting Spending Goal: ", error);
        }
    };

    // scheduled spending function
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

    // navigate to recipe pages
    const handleNavigate = (searchType) => {
        if (searchType === "BASIC") {
            navigate(`/basicsearch`);
        } else if (searchType === "ADVANCED") {
            navigate(`/advancedsearch`);
        }
    };

    // submit new calorie amounts and update backend
    const handleCalorieSubmit = async () => {
        const calories = parseInt(caloriesEntered.amount, 10);
        const date = mockDate ? getCurrentDate().toISOString() : new Date(caloriesEntered.date).toISOString();
    
        if (!calories || isNaN(calories)) {
            alert('Please enter a valid number for current calories.');
            return;
        }
    
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
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
            setCaloriesEntered({amount: "", date: ""});
            await getCurrentCalories();
            renderCalorieGraph(calorieHistoryIndex);
        } catch (error) {
            console.error('Error updating current calories:', error.response?.data || error.message);
        }
    };

    // submit new goal and update backend, and resets
    const handleGoalSubmit = async (reset = false) => {
        const newCalorieGoal = reset ? 0 : parseInt(calorieGoal.goal, 10);
        if ((!newCalorieGoal || isNaN(newCalorieGoal)) && !reset) {
            alert('Please enter a valid number for calorie goal.');
            return;
        }
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        try {
            await axios.put(`${process.env.REACT_APP_API_HOST}/meals/update-calorie-goal/${userId}`,
                { newCalorieGoal },
                { 
                    headers: { 'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json' } 
                }
            );

            if (reset){
                setCalorieGoal({goal: '', locked: false});
            } else {
                setCalorieGoal(prev => ({...prev, goal: newCalorieGoal, locked: true}));
            }
        } catch (error) {
            console.error('Failed to update calorie goal:', error.response ? error.response.data : error);
        }
    };

    // handle submit spending
    const handleSpendingSubmit = async () => {
        const spending = parseInt(spendingEntered.amount, 10);
        const date = mockDate ? new Date(getCurrentDate()) : new Date(spendingEntered.date);
    
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        // console.log(`${day}: ${spending}`);
    
        try {
            await axios.post(`${process.env.REACT_APP_API_HOST}/meals/update-spending-this-week/${userId}`, 
                {day, spending, date},
                {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setSpendingEntered({amount: "", date: ""});
            fetchBudgetAndSpending();
            // window.location.reload();
            renderSpendingGraph();
        } catch (error) {
            console.error('Error submitting spending:', error);
            alert('An error occurred while updating spending');
        }
    };

    // handle submit budget
    const handleBudgetSubmit = async (reset = false) => {
        const thisBudget = reset ? 0 : parseInt(budget.goal, 10);
        if ((!thisBudget || isNaN(thisBudget)) && !reset) {
            alert('Please enter a valid number for budget.');
            return;
        }
    
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
        try {
            await axios.put(`${process.env.REACT_APP_API_HOST}/meals/update-budget/${userId}`,
                { budget: thisBudget },
                { 
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            
            if (reset){
                setBudget({goal: '', locked: false});
            } else {
                setBudget(prev => ({...prev, goal: thisBudget, locked: true}));
            }
        } catch (err) {
            console.error('Error submitting budget:', err);
            // alert('An error occurred while updating the budget');
        }
    };

    // helper function for graph navigation
    const handleCalorieWeekNavigate = async (next = true) => {
        if (next){
            const newIndex = calorieHistoryIndex + 1;
            setCalorieGraphIndex(newIndex);
            if (calorieHistoryIndex === calorieHistorySize){
                renderCalorieGraph(calorieWeekHistory.length + 1);
            } else {
                renderCalorieGraph(newIndex);
            }
        } else {
            if (calorieHistoryIndex > 0) {
                const newIndex = calorieHistoryIndex - 1;
                setCalorieGraphIndex(newIndex);
                renderCalorieGraph(newIndex);
            }
        }
    }

    // helper to render graph dynamically
    const renderCalorieGraph = async (weekIndex = calorieHistoryIndex) => {
        try {
            const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
            if (weekIndex < calorieWeekHistory.length && weekIndex >= 0) {
                const weekKey = Object.keys(calorieWeekHistory[weekIndex])[0];
                const weekData = calorieWeekHistory[weekIndex][weekKey];
    
                setClaorieGraphTitle(`Calorie Consumption From ${weekKey}`);
                const formattedData = daysOfWeek.map(day => {
                    const entry = weekData.find(item => item.day === day);
                    return entry ? entry.amount : 0;
                });
    
                setCalorieGraphData(formattedData);
            } else {
                const weekData = await getWeek();
                const formattedData = daysOfWeek.map(day => {
                    const entry = weekData.find(item => item.day === day);
                    return entry ? entry.amount : 0;
                });
    
                setCalorieGraphData(formattedData);
                setClaorieGraphTitle("Calories Consumed This Week");
            }
        } catch (error) {
            console.error("Error rendering graph data:", error);
        }
    };

    // navigate inside spending graph
    const handleSpendingWeekNavigate = (next = true) => {
        let newIndex = spendingHistoryIndex;
        if (next) {
            if (spendingHistoryIndex < spendingHistory.length - 1) {
                newIndex = spendingHistoryIndex + 1;
            }
        } else {
            if (spendingHistoryIndex > 0) {
                newIndex = spendingHistoryIndex - 1;
            }
        }
    
        setSpendingHistoryIndex(newIndex);
        renderSpendingGraph(newIndex);
    };

    // render spending graph
    const renderSpendingGraph = (weekIndex) => {
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
        // Guard against undefined index or spending history
        if (weekIndex === undefined || !spendingHistory[weekIndex]) return;
    
        const weekData = spendingHistory[weekIndex];
        const formattedData = daysOfWeek.map(day => {
            const entry = weekData.data.find(item => item.day === day);
            return entry ? entry.amount : 0;
        });

        console.log(`spending graph data ${formattedData}`);
    
        setSpendingGraphData(formattedData);
        setSpendingGraphTitle(`Spending From ${weekData.date}`);
    };

    // helper to mock date for debugging
    const getCurrentDate = () => {
        return mockDate ? new Date(mockDate) : new Date();
    };

    // data for calorie graph
    const calorieData = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [
            {
                label: 'Calories Consumed',
                data: calorieGraphData,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                tension: 0.3,
                pointBackgroundColor: 'rgba(75,192,192,1)',
            },
            {
                label: 'Calorie Goal',
                data: Array(7).fill((calorieGoal.goal)),
                color: 'white',
                borderColor: 'rgba(255,0,0,1)',
                backgroundColor: 'rgba(255,0,0,0.2)',
                tension: 0.3,
                borderDash: [5, 5],
                pointBackgroundColor: 'rgba(255,0,0,1)',
            },
        ],
    };

    // options for caloire graph
    const calorieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white'
                }
            },
            title: {
                display: true,
                text: calorieGraphTitle,
                color: 'white',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: 'white'
                },
                grid: {
                    color: 'grey'
                }
            },
            x: {
                ticks: {
                    color: 'white'
                },
                grid: {
                    color: 'grey'
                }
            }
        },
    };

    // data for spending graph
    const spendingData = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [
            {
                label: 'Spending',
                data: spendingGraphData,
                borderColor: 'rgba(54,162,235,1)',
                backgroundColor: 'rgba(54,162,235,0.2)',
                tension: 0.3,
                pointBackgroundColor: 'rgba(54,162,235,1)',
            },
            {
                label: 'Spending Goal',
                data: Array(7).fill(budget.goal),
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

    // use effects below
    useEffect(() => {
        document.title = 'Meal Plan Homepage';
    }, []);

    useEffect(() => {
        // resetWeek();
        // setMockDate("2024-12-17T01:00:00.000Z");
        if (fetchCalorieGoal() && getCurrentCalories){
            try {
                calorieSchedule();
                getLocalWeekCal();
            } catch (error){
                console.error("Error while running schedule");
            }
        }
    }, [mockDate]);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        // save weekHistory to localStorage on update
        if (calorieWeekHistory.length > 0) {
            localStorage.setItem(`${userId}_WeekHistory`, JSON.stringify(calorieWeekHistory));
        }
    }, [calorieWeekHistory]);

    useEffect(() => {
        if (calorieWeekHistory.length > 0) {
            renderCalorieGraph(calorieHistoryIndex);
        } else {
            renderCalorieGraph();
        }
    }, [calorieWeekHistory, calorieHistoryIndex]);

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
            renderSpendingGraph(spendingHistoryIndex);
        }
    }, [spendingHistory, spendingHistoryIndex]);

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
                                    value={caloriesEntered.amount}
                                    onChange={e => setCaloriesEntered(prev => ({ ...prev, amount: e.target.value, date: new Date().toISOString()}))}
                                    onKeyDown={ e => e.key === 'Enter' && handleCalorieSubmit()}
                                />
                                <button className='caloire-submit' onClick={() => handleCalorieSubmit()}>Submit</button>
                            </div>
                            <div className='row2'>
                                <input 
                                    className='goal-input'
                                    placeholder='Enter Calorie Goal'
                                    value={calorieGoal.goal}
                                    onChange={e => setCalorieGoal(prev => ({...prev, goal: e.target.value}))}
                                    onKeyDown={e => e.key === 'Enter' && handleGoalSubmit()}
                                    disabled={calorieGoal.locked}
                                />
                                <button className='goal-submit' onClick={() => handleGoalSubmit()} disabled={calorieGoal.locked}>Submit</button>
                                <button className='reset-goal-button' onClick={() => handleGoalSubmit(true)}></button>
                            </div>
                        </div>
                        <div className='calorie-graph'>
                            <Line data={calorieData} options={calorieOptions} />
                        </div>
                        <div className="week-navigation">
                            <button
                                onClick={ () => handleCalorieWeekNavigate(false)}
                                className="prev-week"
                                disabled={calorieHistoryIndex <= 0}
                            >
                                Previous Week
                            </button>
                            <button
                                onClick={() => handleCalorieWeekNavigate()}
                                className="next-week"
                                disabled={calorieHistoryIndex >= calorieWeekHistory.length}
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
                                    value={spendingEntered.amount}
                                    onChange={e => setSpendingEntered(prev => ({ ...prev, amount: e.target.value, date: new Date().toISOString()}))}
                                    onKeyDown={e => e.key === 'Enter' && handleSpendingSubmit()}
                                />
                                <button className='caloire-submit' onClick={() => handleSpendingSubmit()}>Submit</button>
                            </div>
                            <div className='row2'>
                                <input 
                                    className='budget-input'
                                    placeholder='Enter Budget'
                                    value={budget.goal}
                                    onChange={e => setBudget(prev => ({...prev, goal: e.target.value}))}
                                    onKeyDown={e => e.key === 'Enter' && handleBudgetSubmit()}
                                    disabled={budget.locked}
                                />
                                <button className='goal-submit' onClick={() => handleBudgetSubmit()} disabled={budget.locked}>Submit</button>
                                <button className='reset-goal-button' onClick={() => handleBudgetSubmit(true)}></button>
                            </div>
                        </div>
                        <div className='spending-graph'>
                            <Line data={spendingData} options={spendingOptions} />
                        </div>
                        <div className="week-navigation">
                            <button
                                onClick={ () => handleSpendingWeekNavigate(false)}
                                className="prev-week"
                                disabled={calorieHistoryIndex <= 0}
                            >
                                Previous Week
                            </button>
                            <button
                                onClick={() => handleSpendingWeekNavigate()}
                                className="next-week"
                                disabled={calorieHistoryIndex >= calorieWeekHistory.length}
                            >
                                Next Week
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MealPlan;
