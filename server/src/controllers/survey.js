import mongoose from 'mongoose';
import Survey from '../models/createSurvey.js';

export const submitSurvey = async (req, res) => {
    const { userId, answers } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const newSurveyResponse = new Survey({
            userId,
            answers: new Map()
        });

        // iterate through the answers object and add questionTarget to each entry
        for (const [question, answerDetail] of Object.entries(answers)) {
            const { answer, questionTarget } = answerDetail;
            const value = Array.isArray(answer) ? [...new Set(answer)] : [answer];
            newSurveyResponse.answers.set(question, { value, questionTarget });
        }

        await newSurveyResponse.save();
        res.status(201).json({ message: 'Survey saved successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message, message: 'Failed to save survey' });
    }
};

export const getSurveyFromUser = async (req, res) => {
    const { userId } = req.params;
    const questionTarget = req.query.questionTarget;  // retrieve questionTarget from query parameters

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    try {
        const surveyResponses = await Survey.find({ userId });
        if (!surveyResponses.length) {
            return res.status(404).json({ message: 'No survey found for this user' });
        }

        // filter responses by questionTarget if specified
        if (questionTarget) {
            const filteredResponses = surveyResponses.map(survey => ({
                ...survey._doc,
                answers: Array.from(survey.answers).filter(([question, answer]) => answer.questionTarget === questionTarget || answer.questionTarget === "both")
            })).filter(survey => survey.answers.length > 0);  // ensure to filter out surveys with no matching questionTarget answers

            return res.status(200).json(filteredResponses);
        }

        // if no questionTarget specified, return all responses
        res.status(200).json(surveyResponses);
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
        // fetch all surveys for the user
        const surveys = await Survey.find({ userId }).sort({ createdAt: -1 }).lean();

        if (surveys.length > 1) {
            await verifyCompletion(surveys);
        }

        const isCompleted = surveys.length > 0 && surveys[0].answers && Object.keys(surveys[0].answers).length > 0;
        res.status(200).json({ message: 'Survey completion checked', completed: isCompleted });
    } catch (error) {
        console.error('Error checking survey completion:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const verifyCompletion = async (surveys) => {
    const latestSurvey = surveys[0];
    const surveysToDelete = surveys.slice(1);

    // delete all surveys except the latest one
    await Survey.deleteMany({ _id: { $in: surveysToDelete.map(s => s._id) } });
};