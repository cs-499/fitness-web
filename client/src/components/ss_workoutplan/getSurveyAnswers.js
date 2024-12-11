export const getSpecificAnswer = async (userId, surveyQuestion) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_HOST}/survey/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        let surveyResponses = await response.json();

        if (!Array.isArray(surveyResponses)) {
            console.error('Expected an array but got:', surveyResponses);
            return null;
        }

        // filter answers by 'workout' questionTarget
        surveyResponses = surveyResponses.map(survey => ({
            ...survey,
            answers: Object.fromEntries(
                Object.entries(survey.answers).filter(([question, details]) => details.questionTarget === 'workout')
            )
        }));

        //find the specific answer to the surveyQuestion within the filtered responses
        for (const survey of surveyResponses) {
            if (survey.answers[surveyQuestion]) {
                return survey.answers[surveyQuestion].value;
            }
        }
        return null;
    } catch (error) {
        console.error(`Error fetching answer for question: "${surveyQuestion}"`, error);
        return null;
    }
};