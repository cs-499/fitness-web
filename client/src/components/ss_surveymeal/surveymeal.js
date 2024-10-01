import React, { useState } from 'react';
import '../../App.css';
import './surveymeal.css';
import ParticleSys from '../particles/particle_sys';

const Survey = () => {
    document.title = 'ShapeShifter';

    //list of questions or div IDs
    const questions = [
        'Question 1',
        'Question 2',
        'Question 3',
        'Question 4',
        'Question 5',
        'Question 6',
        'Question 7',
        'Question 8',
        'Question 9',
        'Question 10',
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
                        <h3>{currentQuestionIndex + 1}/{questions.length}</h3>
                    <button type="button" onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default Survey;
