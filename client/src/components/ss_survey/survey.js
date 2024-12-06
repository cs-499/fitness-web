<<<<<<< HEAD
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';
import './survey.css';
=======
// Import necessary libraries and components
import React, { useState } from 'react'; // React library and hooks for state management
import { useNavigate } from 'react-router-dom'; // React Router for programmatic navigation
import axios from 'axios'; // Axios library for making HTTP requests
import '../../App.css'; // Global CSS styles
import './survey.css'; // Styles specific to the Survey component
>>>>>>> main

// Functional component for the Survey page
const Survey = () => {
<<<<<<< HEAD
    document.title = 'Survey';
    const navigate = useNavigate();
    const [surveyCompleted, setSurveyCompleted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
=======
    document.title = 'ShapeShifter'; // Set the document title for the browser tab
    const navigate = useNavigate(); // Hook for navigation
>>>>>>> main

    // Array of survey questions with details
    const questions = [
<<<<<<< HEAD
        {
            question: 'What dietary preferences do you have?',
            questionTarget: 'meal',
            subtitle: 'Select all that apply',
            inputType: 'checkbox',
            choices: ["Vegan", "Vegetarian", "Pescatarian", "Kosher", "Halal", "None"]
        },
        {
            question: 'What allergies or restrictions do you have?',
            questionTarget: 'meal',
            subtitle: 'Select all that apply',
            inputType: 'checkbox',
            choices: ["Nuts", "Gluten", "Shellfish", "Lactose and Dairy", "Eggs", "Soy", "None"]
        },
        {
            question: 'How often do you grocery shop?',
            questionTarget: 'meal',
            subtitle: '',
            inputType: 'radio',
            choices: ["1-2 Times a week", "3-4 Times a week", "5-6 Times a week", "A little bit every day"]
        },
        {
            question: 'How often do you cook?',
            questionTarget: 'meal',
            subtitle: '',
            inputType: 'radio',
            choices: ["Once a day", "Twice a day", "Multiple times a day", "Never"]
        },
        {
            question: 'How often do you meal prep?',
            questionTarget: 'meal',
            subtitle: '',
            inputType: 'radio',
            choices: ["Meal prep for 1-2 days", "Meal prep for 3-4 days", "Meal prep for 5+ days", "Never"]
        },
        {
            question: 'How often do you eat?',
            questionTarget: 'meal',
            subtitle: '',
            inputType: 'radio',
            choices: ["Once a day", "Twice a day", "Three times a day", "Multiple times a day"]
        },
        {
            question: 'What cooking experience do you have?',
            questionTarget: 'meal',
            subtitle: '',
            inputType: 'radio',
            choices: ["None", "Amateur", "Homecook", "Professional"]
        },
        {
            question: 'Do you have the following appliances?',
            questionTarget: 'meal',
            subtitle: 'Select all that apply',
            inputType: 'checkbox',
            choices: ["Oven", "Stovetop", "Microwave", "Refrigerator"]
        },
        {
            question: 'Do you have preferences in ingredients?',
            questionTarget: 'meal',
            subtitle: 'Select all that apply',
            inputType: 'checkbox',
            choices: ["Organic", "NON-GMO", "Free Range", "Farmed", "Wild Caught", "No"]
        },
        {
            question: 'What is your weekly budget?',
            questionTarget: 'meal',
            subtitle: '',
            inputType: 'radio',
            choices: ["10-20", "20-50", "50-100", "100-200", "200+"]
        },
        {
            question: 'What are your goals?',
            questionTarget: 'both',
            subtitle: '',
            inputType: 'radio',
            choices: ["Gain muscle", "Lose fat", "Both"]
        },
        {
            question: 'What is your experience level?',
            questionTarget: 'workout',
            subtitle: '',
            inputType: 'radio',
            choices: ["Beginner", "Intermediate", "Advanced"]
        },
        {
            question: 'How often do you want to work out?',
            questionTarget: 'workout',
            subtitle: 'Select all the days you want',
            inputType: 'checkbox',
            choices: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        },
        {
            question: 'How long do you want your workouts to be?',
            questionTarget: 'workout',
            subtitle: '',
            inputType: 'radio',
            choices: ["30-45 Minutes", "45-60 Minutes", "60-90 Minutes", "90+ Minutes"]
        },
        {
            question: 'What equipment do you have available?',
            questionTarget: 'workout',
            subtitle: 'Select all that apply',
            inputType: 'checkbox',
            choices: ["Bench", "Weights", "Squat Rack", "Cable Machine", "Nothing"]
        },
        {
            question: 'What is your Sex?',
            questionTarget: 'workout',
            subtitle: '',
            inputType: 'radio',
            choices: ["Male", "Female"]
        },
        {
            question: 'Input weight (lbs)',
            questionTarget: 'workout',
            subtitle: '',
            inputType: 'text',
            choices: []
        },
        {
            question: 'Input height (cm)',
            questionTarget: 'workout',
            subtitle: '',
            inputType: 'text',
            choices: []
        }
    ];
    // checks if survey was completed
    useEffect(() => {
        const checkCompletion = async () => {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_HOST}/survey/check-completion/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                // console.log(response);
                setSurveyCompleted(response.data.completed);
                setLoading(false);
            } catch (err) {
                console.error('Error checking survey completion:', err);
                navigate('/homepage');
            }
        };
        checkCompletion();
    }, [navigate]);
=======
        // Each question object contains a question, subtitle, input type, and choices
        { question: 'What dietary preferences do you have?', subtitle: 'Select all that apply', inputType: 'checkbox', choices: ["Vegan", "Vegetarian", "Pescatarian", "Kosher", "Halal", "None"] },
        { question: 'What allergies or restrictions do you have?', subtitle: 'Select all that apply', inputType: 'checkbox', choices: ["Nuts", "Gluten", "Shellfish", "Lactose and Dairy", "Eggs", "Soy", "None"] },
        { question: 'How often do you grocery shop?', subtitle: '', inputType: 'radio', choices: ["1-2 Times a week", "3-4 Times a week", "5-6 Times a week", "A little bit every day"] },
        { question: 'How often do you cook?', subtitle: '', inputType: 'radio', choices: ["Once a day", "Twice a day", "Multiple times a day", "Never"] },
        { question: 'How often do you meal prep?', subtitle: '', inputType: 'radio', choices: ["Meal prep for 1-2 days", "Meal prep for 3-4 days", "Meal prep for 5+ days", "Never"] },
        { question: 'How often do you eat?', subtitle: '', inputType: 'radio', choices: ["Once a day", "Twice a day", "Three times a day", "Multiple times a day"] },
        { question: 'What cooking experience do you have?', subtitle: '', inputType: 'radio', choices: ["None", "Amateur", "Homecook", "Professional"] },
        { question: 'Do you have the following appliances?', subtitle: 'Select all that apply', inputType: 'checkbox', choices: ["Oven", "Stovetop", "Microwave", "Refrigerator"] },
        { question: 'Do you have preferences in ingredients?', subtitle: 'Select all that apply', inputType: 'checkbox', choices: ["Organic", "NON-GMO", "Free Range", "Farmed", "Wild Caught", "No"] },
        { question: 'What is your weekly budget?', subtitle: '', inputType: 'radio', choices: ["10-20", "20-50", "50-100", "100-200", "200+"] },
        { question: 'What are your goals?', subtitle: 'Select all that apply', inputType: 'radio', choices: ["Gain muscle", "Lose fat", "Both"] },
        { question: 'What is your experience level?', subtitle: '', inputType: 'radio', choices: ["Beginner", "Intermediate", "Advanced"] },
        { question: 'How often do you want to work out?', subtitle: 'Select all the days you want', inputType: 'checkbox', choices: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
        { question: 'How long do you want your workouts to be?', subtitle: '', inputType: 'radio', choices: ["30-45 Minutes", "45-60 Minutes", "60-90 Minutes", "90+ Minutes"] },
        { question: 'What equipment do you have available?', subtitle: 'Select all that apply', inputType: 'checkbox', choices: ["Bench", "Weights", "Squat Rack", "Cable Machine", "Nothing"] },
        { question: 'What is your Sex?', subtitle: '', inputType: 'radio', choices: ["Male", "Female"] },
        { question: 'Input weight (lbs)', subtitle: '', inputType: 'text', choices: [] },
        { question: 'Input height (cm)', subtitle: '', inputType: 'text', choices: [] },
    ];
>>>>>>> main

    // State to track the current question index
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // State to track user responses

    // Handler to move to the next question
    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };
<<<<<<< HEAD
=======

    // Handler to move to the previous question
>>>>>>> main
    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    // Handler to update user responses
    const handleInputChange = (e, question) => {
        const { value, type, checked } = e.target;
        const questionTarget = questions.find(q => q.question === question).questionTarget;
    
        setAnswers(prev => {
            const updatedAnswers = { ...prev };
            if (type === 'checkbox') {
<<<<<<< HEAD
                if (!updatedAnswers[question]) {
                    updatedAnswers[question] = { values: [], questionTarget };
                }
                const currentIndex = updatedAnswers[question].values.indexOf(value);
                if (checked && currentIndex === -1) {
                    updatedAnswers[question].values.push(value);
                } else if (!checked && currentIndex !== -1) {
                    updatedAnswers[question].values.splice(currentIndex, 1);
                }
            } else {
                updatedAnswers[question] = { value, questionTarget };
=======
                // For checkboxes, update the list of selected values
                if (checked) {
                    if (!updatedAnswers[question]) updatedAnswers[question] = [];
                    updatedAnswers[question].push(value);
                } else {
                    updatedAnswers[question] = updatedAnswers[question].filter(item => item !== value);
                }
            } else {
                // For other input types, store the value directly
                updatedAnswers[question] = value;
>>>>>>> main
            }
            return updatedAnswers;
        });
    };

<<<<<<< HEAD
=======
    // Handler to submit the survey responses
    const submitSurvey = async () => {
        const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage
        const token = localStorage.getItem('token'); // Retrieve token from local storage

        if (!userId || !token) {
            return; // Do nothing if user ID or token is missing
        }
        try {
            // Send survey responses to the API
            await axios.post(`${process.env.REACT_APP_API_HOST}/survey/submit`, {
                userId,
                answers,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include token in request headers
                    'Content-Type': 'application/json',
                }
            });
            console.log('Thank you for completing the survey.');
            navigate('/homepage'); // Navigate to the homepage after successful submission
        } catch (error) {
            console.error(error); // Log any errors
        }
    };

    // Function to render the input fields for the current question
>>>>>>> main
    const renderChoices = (question, index) => {
        const { inputType, choices } = question;
    
        if (inputType === 'checkbox') {
            return choices.map((choice, i) => (
                <div key={i}>
                    <label>
                        <input
                            className='checkboxInput'
                            type="checkbox"
                            name={`${question.question}-${index}`}
                            value={choice}
<<<<<<< HEAD
                            checked={answers[question.question]?.values?.includes(choice) || false} // Corrected to access the values array
=======
                            checked={answers[question.question]?.includes(choice) || false} // Check if the value is selected
>>>>>>> main
                            onChange={(e) => handleInputChange(e, question.question)}
                        />
                        <div className='choice'>{choice}</div>
                    </label>
                </div>
            ));
        }
    
        if (inputType === 'radio') {
            return choices.map((choice, i) => (
                <div key={i}>
                    <label>
                        <input
                            className='radioInput'
                            type="radio"
                            name={`${question.question}-${index}`}
                            value={choice}
<<<<<<< HEAD
                            checked={answers[question.question]?.value === choice} // Ensuring to access the value property for radio inputs
=======
                            checked={answers[question.question] === choice} // Check if the value is selected
>>>>>>> main
                            onChange={(e) => handleInputChange(e, question.question)}
                        />
                        <div className='radioChoice'>{choice}</div>
                    </label>
                </div>
            ));
        }
    
        if (inputType === 'text') {
            return (
                <div>
                    <input
                        className='textInput'
                        type="number"
                        name={`${question.question}-${index}`}
<<<<<<< HEAD
                        value={answers[question.question]?.value || ''} // Ensuring to access the value property for text inputs
=======
                        value={answers[question.question] || ''} // Bind the input value to state
>>>>>>> main
                        placeholder="Enter Measurements"
                        min="10"
                        onChange={(e) => handleInputChange(e, question.question)}
                    />
                </div>
            );
        }
    };

    const submitSurvey = async () => {
        // makes sure questions are answered
        const answeredQuestions = Object.keys(answers).length;
        const totalQuestions = questions.length;

        if (answeredQuestions !== totalQuestions) {
            console.log('Please answer all required questions before submitting the survey.');
            navigate('/survey');
            return;
        }
    
        const formattedAnswers = Object.keys(answers).reduce((acc, key) => {
            const answerDetail = answers[key];
            if (Array.isArray(answerDetail.values)) {
                acc[key] = { answer: answerDetail.values, questionTarget: answerDetail.questionTarget };
            } else {
                acc[key] = { answer: answerDetail.value, questionTarget: answerDetail.questionTarget };
            }
            return acc;
        }, {});
    
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
        if (!userId || !token) {
            console.error("Authentication data is missing.");
            return;
        }
    
        try {
            await axios.post(`${process.env.REACT_APP_API_HOST}/survey/submit`, {
                userId,
                answers: formattedAnswers,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            console.log('Thank you for completing the survey.');
            try {
                updatePalate(formattedAnswers);
            } catch (error) {
                console.error('Error updating palate', error);
            }
            navigate('/homepage');
        } catch (error) {
            console.error('Error submitting survey:', error.response ? error.response.data : error.message);
        }
    };

    const handleRedoSurvey = async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${process.env.REACT_APP_API_HOST}/survey/delete-survey/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSurveyCompleted(false);
            setAnswers({});
            setCurrentQuestionIndex(0);
        } catch (err) {
            console.error('Failed to delete previous survey:', err);
            setError('Failed to delete previous survey.');
        }
    };

    const updatePalate = async (surveyAnswers) => {
        // console.log("Updated answers: ", surveyAnswers);
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
    
        if (!userId || !token) {
            console.error("Authentication data is missing.");
            return;
        }
    
        // extracting spending range and converting it to bounds
        const spendingRange = surveyAnswers["What is your weekly budget?"]["answer"];
        let lowerBound = 0, upperBound = 0;

        if (typeof spendingRange === 'string' && spendingRange.includes('-')) {
            [lowerBound, upperBound] = spendingRange.split('-').map(value => parseFloat(value));
        }
    
        const palateData = {
            userId,
            dietary_preferences: {
                allergies: surveyAnswers["What allergies or restrictions do you have?"]["answer"],
                diet: surveyAnswers["What dietary preferences do you have?"]["answer"],
                ingredients: surveyAnswers["Do you have preferences in ingredients?"]["answer"]
            },
            misc: {
                cooking_frequency: surveyAnswers["How often do you cook?"]["answer"],
                shopping_frequency: surveyAnswers["How often do you grocery shop?"]["answer"],
                prepping_frequency: surveyAnswers["How often do you meal prep?"]["answer"],
                proficiency: surveyAnswers["What cooking experience do you have?"]["answer"]
            },
            appliances: surveyAnswers["Do you have the following appliances?"]["answer"],
            spending_details: {
                spending_goal: {
                    lower_bound: lowerBound,
                    upper_bound: upperBound
                }
            },
            goal_type: {
                goal_type: surveyAnswers["What are your goals?"]["answer"]
            }
        };
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_HOST}/meals/update/${userId}`, palateData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
    
            if (response.status === 200) {
                console.log('Palate updated successfully.');
            }
        } catch (error) {
            console.error('Error updating palate:', error.response ? error.response.data : error.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <div className="Wrapper">
<<<<<<< HEAD
                {surveyCompleted ? (
                    <div className="survey-prompt">
                        <p>You have already completed the survey. Do you want to start a new survey?</p>
                        <button onClick={() => handleRedoSurvey()}>Start New Survey</button>
                        <button onClick={() => navigate('/homepage')}>Go to Homepage</button>
                    </div>
                ) : (
                    <div className='questions_And_Answers'>
                        <div className="questions">
                            <h3 className='questionText'>{questions[currentQuestionIndex].question}</h3>
                            <p className='questionSubtitle'>{questions[currentQuestionIndex].subtitle}</p>
                        </div>
                        <div className='answers'>
                            {renderChoices(questions[currentQuestionIndex], currentQuestionIndex)}
                        </div>
                        <div className="question-buttons">
                            <button className='changeButton' type="button" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                                Previous
                            </button>
                            <h3>{currentQuestionIndex + 1}/{questions.length}</h3>
                            <button className='changeButton' type="button" onClick={currentQuestionIndex === questions.length - 1 ? submitSurvey : handleNext}>
                                {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
                            </button>
                        </div>
                    </div>
                )}
=======
                <div className='questions_And_Answers'>
                    <div className="questions">
                        {/* Display the current question */}
                        <h3 className='questionText'>{questions[currentQuestionIndex].question}</h3>
                        <p className='questionSubtitle'>{questions[currentQuestionIndex].subtitle}</p>
                    </div>
                    <div className='answers'>
                        {/* Render the input fields for the current question */}
                        {renderChoices(questions[currentQuestionIndex], currentQuestionIndex)}
                    </div>
                </div>
                <div className="question-buttons">
                    {/* Navigation buttons */}
                    <button className='changeButton' type="button" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                        Previous
                    </button>
                    <h3>{currentQuestionIndex + 1}/{questions.length}</h3>

                    <button className='changeButton' type="button" onClick={currentQuestionIndex === questions.length - 1 ? submitSurvey : handleNext}>
                        {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
                    </button>
                </div>
>>>>>>> main
            </div>
        </>
    );
};

export default Survey; // Export the component for use in other parts of the application
