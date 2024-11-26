export const getSpecificAnswer = async (userId, questionText) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_HOST}/survey/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const surveyResponses = await response.json();

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
        return null;
    } catch (error) {
        console.error(`No answer found for question: "${questionText}"`, error);
        return null;
    }
};