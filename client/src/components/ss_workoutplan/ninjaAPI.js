import $ from 'jquery';
import { getSpecificAnswer } from './getSurveyAnswers.js';

const apiKey = process.env.REACT_APP_NINJA_API;

const experienceToDifficulty = {
    'Beginner': 'beginner',
    'Intermediate': 'intermediate',
    'advanced': 'expert',
};

// Get exercises based on the user’s experience level
const getExercisesByExperienceLevel = async () => {
    const userId = localStorage.getItem('userId');
    const surveyQuestion = "What is your experience level?";
    const experienceLevel = await getSpecificAnswer(userId, surveyQuestion);

    if (!experienceLevel || experienceLevel.length === 0) {
        console.log('No experience level found.');
        return [];
    }

    const userExperience = experienceLevel;
    const difficulty = experienceToDifficulty[userExperience];

    if (!difficulty) {
        console.log('No matching difficulty level found for experience:', userExperience);
        return [];
    }
    
    // code example from https://www.api-ninjas.com/api/exercises
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'GET',
            url: `https://api.api-ninjas.com/v1/exercises?difficulty=${difficulty}`,
            headers: { 'X-Api-Key': apiKey },
            success: function (result) {
                // Always resolve with an array
                resolve(result || []);
            },
            error: function ajaxError(jqXHR) {
                console.error('Error fetching exercises:', jqXHR.responseText);
                resolve([]);
            }
        });
    });
};

export default getExercisesByExperienceLevel;