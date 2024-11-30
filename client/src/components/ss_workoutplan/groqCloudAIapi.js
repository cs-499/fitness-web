import Groq from "groq-sdk";
import getExercisesByExperienceLevel from './ninjaAPI.js';

const groq = new Groq({ apiKey: process.env.REACT_APP_GROQ_API_KEY, dangerouslyAllowBrowser: true });

export async function groqCloudAi() {
    // Fetch exercises based on user's survey responses
    const exercises = await getExercisesByExperienceLevel();
    if (!exercises || exercises.length === 0) {
        console.error('No exercises found from the Ninja API response.');
        return { error: 'No exercises found.' };
    }

    const exercisesList = exercises.map(ex => ex.name).join(", ");
    const content = `Here are some exercises: ${exercisesList}. Please only give me one of this excercises and make sure you only give me back the response of that one excercise.`;

    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: content,
                },
            ],
            model: "llama3-8b-8192",
        });

        return response;
    } catch (error) {
        console.error('Error with Groq AI API:', error);
        return { error: 'Groq AI API call failed.' };
    }
}

export default groqCloudAi;