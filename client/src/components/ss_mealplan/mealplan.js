import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';
import './mealplan.css';
import NavBar from "../navbar/nav_bar";
import { useNavigate } from 'react-router-dom';

const MealPlan = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState();
    const [error, setError] = useState('');
    const [calorieGoal, setCalorieGoal] = useState('');
    const [enteredCalories, setEnteredCalories] = useState('');
    const [isGoalLocked, setIsGoalLocked] = useState(false);
    const [isBudgetLocked, setIsBudgetLocked] = useState(false);
    const [currentCalories, setCurrent] = useState(0);
    const [lastDate, setLastDate] = useState('');
    const [budget, setBudget] = useState('');
    const [spending, setEnteredSpending] = useState('');

    useEffect(() => {
        document.title = 'Meal Plan Homepage';
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
    }, []);

    useEffect(() => {
        console.log(currentCalories, lastDate);
    }, [currentCalories, lastDate]);

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

    const schedule = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
        // get current date and formatted day name (e.g., Monday, Tuesday)
        const currentDateObj = new Date(); // Current date object
        const currentDate = currentDateObj.toISOString().split('T')[0]; // extract date portion (YYYY-MM-DD)
        const dateOfUpdate = currentDateObj.toISOString();
        const dayName = currentDateObj.toLocaleDateString('en-US', { weekday: 'long' });
        const lastEntryDate = lastDate ? lastDate.split('T')[0] : '';
    
        try {
            // check if the current date matches the lastDate
            if (currentDate != lastEntryDate) {
                await axios.post(`${process.env.REACT_APP_API_HOST}/meals/update-calories-this-week/${userId}`,
                    { day: dayName, amount: currentCalories, date: dateOfUpdate},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
            }
            // reset current calories to 0 and start new day
            const resetCurrent = async () => {
                const date = new Date().toISOString();
                const calories = 0;
            
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
                } catch (error) {
                    console.error('Error updating current calories:', error.response?.data || error.message);
                }
            };

            const isResetRequired = (weekData) => {
                const currentDate = new Date();
                const sundayEntry = weekData.find(entry => entry.day === 'Sunday');
        
                if (!sundayEntry || !sundayEntry.date) {
                    console.log('No valid Sunday entry found.');
                    return false;
                }
        
                const sundayDate = new Date(sundayEntry.date);
                return currentDate > sundayDate; // Reset if current date is ahead of Sunday date
            };

            try {
                const weekData = await getWeek();
                if (weekData && isResetRequired(weekData)){
                    resetWeek();
                }
            } catch (error) {
                console.error("Failed to reset to new week: ", error.message);
            }

            resetCurrent();
        } catch (error) {
            console.error('Error in schedule function:', error.message);
        }
    };

    const getWeek = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_HOST}/meals/get-calories-this-week/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response.data.data);
        } catch (error){
            console.error("Error getting calories this week: ", error);
        };
    }

    const resetWeek = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
        try {
            await axios.delete(`${process.env.REACT_APP_API_HOST}/meals/reset-week/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Weekly data has been reset.');
        } catch (error) {
            console.error('Failed to reset weekly data:', error.response?.data || error.message);
            alert('Failed to reset weekly data. Please try again.');
        }
    };

    const handleSpendingSubmit = async () => {

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