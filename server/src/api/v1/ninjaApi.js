import request from 'request';
import { getSpecificAnswer } from './parseSurvey.js';

const experienceToDifficulty = {
    'Beginner': 'beginner',
    'Intermediate': 'intermediate',
    'Advanced': 'expert',
};

// Get exercises based on the user’s experience level
const getExercisesByExperienceLevel = async (surveyResponses, requestMethod = request.get) => {
    const experienceLevel = await getSpecificAnswer(surveyResponses, 'What is your experience level?');

    if (!experienceLevel || experienceLevel.length === 0) {
        console.log('No experience level found.');
        return;
    }

    const userExperience = experienceLevel;
    const difficulty = experienceToDifficulty[userExperience];

    if (!difficulty) {
        console.log('No matching difficulty level found for experience:', userExperience);
        return;
    }

    requestMethod({
        url: `https://api.api-ninjas.com/v1/exercises?difficulty=${difficulty}`,
        headers: {
            'X-Api-Key': process.env.NINJA_API,
        },
    }, function (error, response, body) {
        if (error) return console.error('Request failed:', error);
        else if (response.statusCode !== 200) return console.error('Error:', response.statusCode, body.toString('utf8'));
        else console.log(body);
    });
};

export default getExercisesByExperienceLevel;