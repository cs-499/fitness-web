import React, { useState } from 'react';
import '../../App.css';
import './surveyworkout.css';
import ParticleSys from '../particles/particle_sys';

const SurveyWorkout = () => {
    document.title = 'ShapeShifter';

    //list of questions or div IDs
    const questions = [
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

    // state to track the current question index
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    // state to store the answers
    const [answers, setAnswers] = useState({});

    // handlers for moving between questions
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

    // handler for updating answers
    const handleInputChange = (e, question) => {
        const { name, value, type, checked } = e.target;
        setAnswers((prev) => {
            const updatedAnswers = { ...prev };
            if (type === 'checkbox') {
                // handle checkbox: add/remove choices from an array
                if (checked) {
                    if (!updatedAnswers[question]) updatedAnswers[question] = [];
                    updatedAnswers[question].push(value);
                } else {
                    updatedAnswers[question] = updatedAnswers[question].filter(item => item !== value);
                }
            } else {
                // handle text and radio inputs
                updatedAnswers[question] = value;
            }
            return updatedAnswers;
        });
    };

    // render choices dynamically based on input type
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
                        placeholder="Input"
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
                    {/* display the current question based on index */}
                    <h3>{questions[currentQuestionIndex].question}</h3>
                    <p>{questions[currentQuestionIndex].subtitle}</p>
                    
                    {/* render the input fields for the current question */}
                    {renderChoices(questions[currentQuestionIndex], currentQuestionIndex)}
                </div>
                
                <div className="question-buttons">
                    {/* buttons to navigate through questions */}
                    <button type="button" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                        Previous
                    </button>
                    
                    <h3>{currentQuestionIndex + 1}/{questions.length}</h3>

                    <button type="button" onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SurveyWorkout;