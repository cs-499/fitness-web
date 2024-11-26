import getExercisesByExperienceLevel from '../api/v1/ninjaApi.js';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const groqCloudAi = async (req, res) => {
    try {
        const { surveyResponses } = req.body; // Ensure the client sends surveyResponses in the request body

        // Fetch exercises based on the user's survey responses
        const exercises = await getExercisesByExperienceLevel(surveyResponses);
        if (!exercises || exercises.length === 0) {
            return res.status(404).json({ message: 'No exercises found from API response' });
        }

        const exercisesList = exercises.map(ex => ex.name).join(", ");
        const content = `Here are some exercises: ${exercisesList}. Which ones do you think are the best for a user, and why?`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content }],
            model: "llama3-8b-8192",
        });

        const responseContent = chatCompletion.choices[0]?.message?.content || "No content found!";
        res.json({ response: responseContent });
    } catch (error) {
        console.error('Error in groqCloudAi:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};