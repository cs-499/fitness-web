import request from 'request';
import { connectDB } from './src/connectDB.js';
import { getSpecificAnswer } from './src/controllers/api/v1/parseSurvey.js';


const experienceToDifficulty = {
    'Beginner': 'beginner',
    'Intermediate': 'intermediate',
    'advanced': 'expert',
};

const getExercises = async (surveyResponses, requestMethod = request.get) => {
    // const userId = '66f5888f03a216254b8174ea'; // Example userId
    await connectDB();
    const experienceLevel = await getSpecificAnswer('66f5888f03a216254b8174ea', 'What is your experience level?');

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

getExercises()