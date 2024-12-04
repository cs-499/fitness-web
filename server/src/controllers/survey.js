import mongoose from 'mongoose';
import Survey from '../models/createSurvey.js';

export const submitSurvey = async (req, res) => {
    const { userId, answers } = req.body;
    // throw 400's if user does not exist
    if (!userId) {
        return res.status(400);
    }
    try {
        const newSurveyResponse = new Survey({
            userId,
            answers: new Map()
        });
        for (const question in answers) {
            const answer = answers[question];
            // If answer is an array, use Set to prevent duplicates
            if (Array.isArray(answer)) {
                newSurveyResponse.answers.set(question, [...new Set(answer)]);
            } else {
                newSurveyResponse.answers.set(question, [answer]);
            }
        }
        await newSurveyResponse.save();
        res.status(201).json({ message: 'Survey saved successfully!' });
    } catch (error) {
        res.status(500).json({error: error.message });
    }
};

export const getSurveyFromUser = async (req, res) => {
    const { userId } = req.params;
    // Check for userId in the database
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    try {
        const surveyResponses = await Survey.find({ userId });
        if (!surveyResponses.length) {
            return res.status(404).json({ message: 'No survey for this user' });
        }
        res.status(200).json(surveyResponses);
        return surveyResponses;
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteSurvey = async (req, res) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const result = await Survey.deleteMany({ userId: userId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No surveys found to delete.' });
        }
        res.status(200).json({ message: 'All surveys have been deleted successfully.' });
    } catch (error) {
        console.error('Failed to delete surveys:', error);
        res.status(500).json({ message: 'Failed to delete surveys', error: error.message });
    }
};

export const checkSurveyCompletion = async (req, res) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const survey = await Survey.findOne({ userId }).lean();

        if (!survey) {
            return res.status(404).json({ message: 'No survey found for this user', completed: false });
        }

        // Check if the answers object has any keys
        const isCompleted = survey.answers && Object.keys(survey.answers).length > 0;
        res.status(200).json({ message: 'Survey completion checked', completed: isCompleted });
    } catch (error) {
        console.error('Error checking survey completion:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};