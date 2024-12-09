import Groq from 'groq-sdk';
import getExercisesByExperienceLevel from './ninjaAPI.js';
import getNumberOfExercises from './filters.js';

const groq = new Groq({
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
});

/**
 * Generate a workout plan using Groq AI.
 * Fetches exercises from the Ninja API and passes exercise to Groq for evaluation.
 */
const groqCloudAi = async () => {
    try {
        const exercises = await getExercisesByExperienceLevel();
        const selectedExercise = exercises[Math.floor(Math.random() * exercises.length)];
        
        const numExercises = await getNumberOfExercises();

        const content = `Include the following exercise: ${selectedExercise.name} (${selectedExercise.muscle}, ${selectedExercise.type}). ` + numExercises + ` exercises only and no other information.`;

        console.log(`Invoking Groq AI with content: ${content}`);

        const response = await groq.chat.completions.create({
            messages: [{ role: 'user', content }],
            model: 'llama3-8b-8192',
        });

        if (response?.choices?.[0]?.message?.content) {
            const plan = response.choices[0].message.content.trim();
            console.log('Groq AI generated plan:', plan);
            return { success: true, plan };
        } else {
            console.error('Groq AI returned no content.');
            return { success: false, error: 'No workout plan generated.' };
        }
    } catch (error) {
        console.error('Error generating workout plan:', error);
        return { success: false, error: 'Failed to generate workout plan.' };
    }
};

export default groqCloudAi;