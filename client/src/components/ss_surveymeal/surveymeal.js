import React, { useState } from 'react';
import '../../App.css';
import './surveymeal.css';
import ParticleSys from '../particles/particle_sys';

const Survey = () => {
    document.title = 'ShapeShifter';

    //list of questions or div IDs
    const questions = [
        'Question 1 content goes here',
        'Question 2 content goes here',
        'Question 3 content goes here',
        'Question 4 content goes here',
        'Question 5 content goes here',
        'Question 6 content goes here',
        'Question 7 content goes here',
        'Question 8 content goes here',
        'Question 9 content goes here',
        'Question 10 content goes here',
    ];

    //state to track the current question index
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    //handlers for moving between questions
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

    return (
        <div className="page">
            <div className="intake-survey">
                <div className="intake-question">
                    {/* display current question based on index */}
                    <h3>{questions[currentQuestionIndex]}</h3>
                </div>
                <div class="question-buttons">
                    {/* buttons to navigate */}
                    <button type="button" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>Previous</button>
                        {/* Current Question */}
                        <h3>{currentQuestionIndex}/{questions.length}</h3>
                    <button type="button" onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default Survey;
