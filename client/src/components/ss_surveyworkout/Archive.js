//This will be the Survey page, where users will take the survey and then based off that the api will generate a workout

import React from 'react';
import '../../App.css';
import './survey.css';
import ParticleSys from '../particles/particle_sys';

//function to show the next or previous question
function showQuestion(showDiv, hideDiv){
    document.getElementById(showDiv).style.display="block";
    document.getElementById(hideDiv).style.display="none";
};

const Survey = () => {
    document.title = 'ShapeShifter'

    //Extremely Ghetto way of doing it, but it works
    //function showQuestion works by having the first argument the one it shows (the next one), and the second the one that hides (the current one)
    return (
        <div class="intake-survey">
            <div class="intake-question" id="question1">
                <button type='button' disabled>Previous</button>
                <button id="button1" type='button' onClick={showQuestion.bind('', 'question2', 'question1')}>Next</button>
            </div>
            <div class="intake-question" id="question2">
                <button type='button' onClick={showQuestion.bind('', 'question1', 'question2')}>Previous</button>
                <button type='button' onClick={showQuestion.bind('', 'question3', 'question2')}>Next</button>
            </div>
            <div class="intake-question" id="question3">
                <button type='button' onClick={showQuestion.bind('', 'question2', 'question3')}>Previous</button>
                <button type='button' onClick={showQuestion.bind('', 'question4', 'question3')}>Next</button>
            </div>
            <div class="intake-question" id="question4">
                <button type='button' onClick={showQuestion.bind('', 'question3', 'question4')}>Previous</button>
                <button type='button' onClick={showQuestion.bind('', 'question5', 'question4')}>Next</button>
            </div>
            <div class="intake-question" id="question5">
                <button type='button' onClick={showQuestion.bind('', 'question4', 'question5')}>Previous</button>
                <button type='button' onClick={showQuestion.bind('', 'question6', 'question5')}>Next</button>
            </div>
            <div class="intake-question" id="question6">
                <button type='button' onClick={showQuestion.bind('', 'question5', 'question6')}>Previous</button>
                <button type='button' onClick={showQuestion.bind('', 'question7', 'question6')}>Next</button>
            </div>
            <div class="intake-question" id="question7">
                <button type='button' onClick={showQuestion.bind('', 'question6', 'question7')}>Previous</button>
                <button type='button' onClick={showQuestion.bind('', 'question8', 'question7')}>Next</button>
            </div>
            <div class="intake-question" id="question8">
                <button type='button' onClick={showQuestion.bind('', 'question7', 'question8')}>Previous</button>
                <button type='button' onClick={showQuestion.bind('', 'question9', 'question8')}>Next</button>
            </div>
            <div class="intake-question" id="question9">
                <button type='button' onClick={showQuestion.bind('', 'question8', 'question9')}>Previous</button>
                <button type='button' onClick={showQuestion.bind('', 'question10', 'question9')}>Next</button>
            </div>
            <div class="intake-question" id="question10">
                <button type='button' onClick={showQuestion.bind('', 'question9', 'question10')}>Previous</button>
                <button type='button' disabled>Next</button>
            </div>
        </div>
    )
}


export default Survey;

