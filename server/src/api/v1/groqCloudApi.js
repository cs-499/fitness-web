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