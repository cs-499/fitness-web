import Groq from 'groq-sdk';

// Initialize Groq SDK
const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Use Groq AI to generate a workout plan for a specific date.
 */
export async function groqCloudAi(userId, date) {
  try {
    const content = `Generate a personalized workout plan for the user on ${date}.`;
    console.log(`Invoking Groq AI for userId: ${userId}, date: ${date}`);

    const response = await groq.chat.completions.create({
      messages: [{ role: 'user', content }],
      model: 'llama3-8b-8192',
    });

    if (response?.choices?.[0]?.message?.content) {
      const plan = response.choices[0].message.content.trim();
      console.log('Groq AI generated plan:', plan);
      return { success: true, plan };
    } else {
      console.error('Groq AI returned no content for date:', date);
      return { success: false, error: 'No workout plan generated.' };
    }
  } catch (error) {
    console.error('Error invoking Groq AI:', error);
    return { success: false, error: 'Failed to generate workout plan.' };
  }
}
