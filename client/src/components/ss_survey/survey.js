// Import necessary libraries and components
import React, { useState } from 'react'; // React library and hooks for state management
import { useNavigate } from 'react-router-dom'; // React Router for programmatic navigation
import axios from 'axios'; // Axios library for making HTTP requests
import '../../App.css'; // Global CSS styles
import './survey.css'; // Styles specific to the Survey component

// Functional component for the Survey page
const Survey = () => {
    document.title = 'ShapeShifter'; // Set the document title for the browser tab
    const navigate = useNavigate(); // Hook for navigation

    // Array of survey questions with details
    const questions = [
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

    // State to track the current question index
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // State to track user responses

    // Handler to move to the next question
    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    // Handler to move to the previous question
    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    // Handler to update user responses
    const handleInputChange = (e, question) => {
        const { name, value, type, checked } = e.target;
        setAnswers((prev) => {
            const updatedAnswers = { ...prev };
            if (type === 'checkbox') {
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
            }
            return updatedAnswers;
        });
    };

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
                            checked={answers[question.question]?.includes(choice) || false} // Check if the value is selected
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
                            checked={answers[question.question] === choice} // Check if the value is selected
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
                        value={answers[question.question] || ''} // Bind the input value to state
                        placeholder="Enter Measurements"
                        min="10"
                        onChange={(e) => handleInputChange(e, question.question)}
                    />
                </div>
            );
        }
    };

    return (
        <>
            <div className="Wrapper">
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
            </div>
        </>
    );
};

export default Survey; // Export the component for use in other parts of the application
