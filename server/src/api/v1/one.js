import { getSurveyFromUser } from '../../controllers/survey.js';

export const getSpecificAnswer = async (userId, questionText) => {
    // Mock response object to capture the output
    const mockRes = {
        status: () => ({
            json: (data) => data
        }),
    };

    try {
        const surveyResponses = await getSurveyFromUser({ params: { userId } }, mockRes);
        if (!Array.isArray(surveyResponses)) {
            console.error('Expected an array but got:', surveyResponses);
            return null;
        }
        for (const response of surveyResponses) {
            if (response.answers) {
                // Convert the Map to an object if it's a Map
                const answersObject = response.answers instanceof Map ? Object.fromEntries(response.answers) : response.answers;
                if (answersObject[questionText]) {
                    return answersObject[questionText];
                }
            }
        }
        // Return null if the question is not found
        return null;
    } catch (error) {
        console.error('Error fetching answer', error);
    }
};

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

import Groq from "groq-sdk";
import getExercisesByExperienceLevel from './ninjaApi.js'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// // code from https://console.groq.com/docs/quickstart
// export async function groqCloudAi() {
//     try {
//         const chatCompletion = await getGroqChatCompletion(surveyResponses);
//         // Print the completion returned by the LLM.
//         console.log(chatCompletion.choices[0]?.message?.content || "No content found!");
//     } catch (error) {
//     console.error(error);
//     } 
// }
  
export async function groqCloudAi(surveyResponses) {

    // fetch json response from ninjaAPI for excercises based on user's survey
    const exercises = await getExercisesByExperienceLevel(surveyResponses);
    if (!exercises || exercises.length === 0) {
        console.log('No exercises found from ninja API response')
    }

    const exercisesList = exercises.map(ex => ex.name).join(", ");
    const content = `Here are some exercises: ${exercisesList}. Which ones do you think are the best for a user, and why?`;

    return groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
      model: "llama3-8b-8192",
    });
}

export default groqCloudAi;