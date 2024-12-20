import { getSpecificAnswer } from './getSurveyAnswers.js';

const getNumberOfExercises = async () => {
    const userId = localStorage.getItem('userId');
    const lengthQuestion = "How long do you want your workouts to be?";
    const workoutLength = await getSpecificAnswer(userId, lengthQuestion);

    if (!workoutLength || workoutLength.length === 0) {
        console.log('No workout length found.');
        return "Three"; 
    }

    switch (workoutLength[0]) {
        case "30-45 Minutes":
            return "Two";
        case "45-60 Minutes":
            return "Three";
        case "60-90 Minutes":
        case "90+ Minutes":
            return "Four";
        default:
            console.log('Unexpected workout length:', workoutLength[0]);
            return "Three";
    }
};

export default getNumberOfExercises;