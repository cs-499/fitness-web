import { getSpecificAnswer } from './api/v1/parseSurvey.js';
import { connectDB } from '../connectDB.js';
import mongoose from 'mongoose';

const testGetSpecificAnswer = async () => {
    await connectDB();
    const userId = '66f5888f03a216254b8174ea'; // Example userId
    const questionText = 'What allergies restrictions do you have?';

    const answer = await getSpecificAnswer(userId, questionText);

    if (answer) {
        console.log(answer); // Logs the specific answer
    } else {
        console.log('No answer found for the specified question.');
    }
};

// Run the test
testGetSpecificAnswer();