import mongoose from 'mongoose';
import { surveySchema } from '../models/createSurvey.js';

const Survey = mongoose.model('Survey', surveySchema);

export const submitSurvey = async (req, res) => {
    const { userId, answers } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'Missing userId' });
    }

    try {
        const newSurveyResponse = new Survey({
            userId,
            answers,
        });

        await newSurveyResponse.save();
        res.status(201).json({ message: 'Survey saved successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving survey response.' });
    }
};