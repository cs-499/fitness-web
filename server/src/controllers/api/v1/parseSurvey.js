import { getSurveyFromUser } from '../../survey.js';

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