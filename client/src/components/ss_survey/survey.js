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
    return(
        <div>
            <div id='question1' className='firstQuestion'>
                joe
                <button type='button' disabled>Previous</button>
                <button id="button1" type='button' onClick={showQuestion.bind('', 'question2', 'question1')}>Next</button>
            </div>
            
            <div id='question2' className='question'>
                Donald
                <button type='button' onClick={showQuestion.bind('', 'question1', 'question2')}>Previous</button>
                <button type='button' onClick={showQuestion.bind('', 'question3', 'question2')}>Next</button>
            </div>
            <div id='question3' className='question'>
                Kamala
                <button type='button' onClick={showQuestion.bind('', 'question2', 'question3')}>Previous</button>
                <button type='button' disabled>Next</button>
            </div>
        </div>
    )
}



export default Survey;