import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';
import './survey.css';

const Survey = () => {
    document.title = 'ShapeShifter';
    const navigate = useNavigate();

    const questions = [
        {
            question: 'What dietary preferences do you have?',
            subtitle: 'Select all that apply',
            inputType: 'checkbox',
            choices: ["Vegan", "Vegetarian", "Pescatarian", "Kosher", "Halal"]
        },
        {
            question: 'What allergies or restrictions do you have?',
            subtitle: 'Select all that apply',
            inputType: 'checkbox',
            choices: ["Nuts", "Gluten", "Shellfish", "Lactose and Dairy", "Eggs", "Soy"]
        },
        {
            question: 'How often do you grocery shop?',
            subtitle: '',
            inputType: 'radio',
            choices: ["1-2 Times a week", "3-4 Times a week", "5-6 Times a week", "A little bit every day"]
        },
        {
            question: 'How often do you cook?',
            subtitle: '',
            inputType: 'radio',
            choices: ["Once a day", "Twice a day", "Multiple times a day"]
        },
        {
            question: 'How often do you meal prep?',
            subtitle: '',
            inputType: 'radio',
            choices: ["Meal prep for 1-2 days", "Meal prep for 3-4 days", "Meal prep for 5+ days"]
        },
        {
            question: 'How often do you eat?',
            subtitle: '',
            inputType: 'radio',
            choices: ["Once a day", "Twice a day", "Three times a day", "Multiple times a day"]
        },
        {
            question: 'What cooking experience do you have?',
            subtitle: '',
            inputType: 'radio',
            choices: ["None", "Amateur", "Homecook", "Professional"]
        },
        {
            question: 'Do you have the following appliances?',
            subtitle: 'Select all that apply',
            inputType: 'checkbox',
            choices: ["Oven", "Stovetop", "Microwave", "Refrigerator"]
        },
        {
            question: 'Do you have preferences in ingredients?',
            subtitle: 'Select all that apply',
            inputType: 'checkbox',
            choices: ["Organic", "NON-GMO", "Free Range", "Farmed", "Wild Caught"]
        },
        {
            question: 'What is your budget?',
            subtitle: '',
            inputType: 'radio',
            choices: ["10-20", "20-50", "50-100", "100-200", "200+"]
        },
        {
            question: 'What are your goals?',
            subtitle: 'Select all that apply',
            inputType: 'checkbox',
            choices: ["Gain muscle", "Lose fat", "Maintain health"]
        },
        {
            question: 'What is your experience level?',
            subtitle: '',
            inputType: 'radio',
            choices: ["Beginner", "Intermediate", "advanced"]
        },
        {
            question: 'How often do you want to work out?',
            subtitle: '',
            inputType: 'radio',
            choices: ["1-2 Times a week", "3-4 Times a week", "4-5 Times a week", "6+ a week"]
        },
        {
            question: 'How long do you want your workouts to be?',
            subtitle: '',
            inputType: 'radio',
            choices: ["15 minutes", "30 minutes", "45 minutes", "1 hour", "1+ hours"]
        },
        {
            question: 'What equipment do you have available?',
            subtitle: 'Select all that apply',
            inputType: 'checkbox',
            choices: ["Bench", "Weights", "Squat Rack", "Cable Machine", "Nothing"]
        },
        {
            question: 'What is your Sex?',
            subtitle: '',
            inputType: 'radio',
            choices: ["Male", "Female", "Not Specified"]
        },
        {
            question: 'Input weight (lbs)',
            subtitle: '',
            inputType: 'text',
            choices: []
        },
        {
            question: 'Input height (cm)',
            subtitle: '',
            inputType: 'text',
            choices: []
        }
    ];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleInputChange = (e, question) => {
        const { name, value, type, checked } = e.target;
        setAnswers((prev) => {
            const updatedAnswers = { ...prev };
            if (type === 'checkbox') {
                if (checked) {
                    if (!updatedAnswers[question]) updatedAnswers[question] = [];
                    updatedAnswers[question].push(value);
                } else {
                    updatedAnswers[question] = updatedAnswers[question].filter(item => item !== value);
                }
            } else {
                updatedAnswers[question] = value;
            }
            return updatedAnswers;
        });
    };

    const submitSurvey = async () => {
        // get userId from local storage (stored from login)
        const userId = localStorage.getItem('userId');
        if (!userId) {
            return;
        }
        try {
            await axios.post('http://localhost:5000/survey/submit', {
                userId,
                answers,
            });
            console.log('Thank you for completing the survey.');
            navigate('/homepage');
        } catch (error) {
            console.error(error);
        }
    };

    const renderChoices = (question, index) => {
        const { inputType, choices } = question;

        if (inputType === 'checkbox') {
            return choices.map((choice, i) => (
                <div key={i}>
                    <label>
                        <input
                            type="checkbox"
                            name={`${question.question}-${index}`}
                            value={choice}
                            checked={answers[question.question]?.includes(choice) || false}
                            onChange={(e) => handleInputChange(e, question.question)}
                        />
                        {choice}
                    </label>
                </div>
            ));
        }

        if (inputType === 'radio') {
            return choices.map((choice, i) => (
                <div key={i}>
                    <label>
                        <input
                            type="radio"
                            name={`${question.question}-${index}`}
                            value={choice}
                            checked={answers[question.question] === choice}
                            onChange={(e) => handleInputChange(e, question.question)}
                        />
                        {choice}
                    </label>
                </div>
            ));
        }

        if (inputType === 'text') {
            return (
                <div>
                    <input
                        type="number"
                        name={`${question.question}-${index}`}
                        value={answers[question.question] || ''}
                        placeholder="Enter your budget"
                        min="10"
                        onChange={(e) => handleInputChange(e, question.question)}
                    />
                </div>
            );
        }
    };

    return (
        <div className="page">
            <div className="intake-survey">
                <div className="intake-question">
                    {/* Display the current question based on index */}
                    <h3>{questions[currentQuestionIndex].question}</h3>
                    <p>{questions[currentQuestionIndex].subtitle}</p>

                    {/* Render the input fields for the current question */}
                    {renderChoices(questions[currentQuestionIndex], currentQuestionIndex)}
                </div>

                <div className="question-buttons">
                    {/* Buttons to navigate through questions */}
                    <button type="button" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                        Previous
                    </button>

                    <h3>{currentQuestionIndex + 1}/{questions.length}</h3>

                    <button type="button" onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
                        Next
                    </button>
                </div>
                {currentQuestionIndex === questions.length - 1 && (
                    <button type="button" onClick={submitSurvey}>
                        Submit Survey
                    </button>
                )}
            </div>
        </div>
    );
};

export default Survey;