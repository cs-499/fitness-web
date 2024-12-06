import express from 'express';
import { submitSurvey, getSurveyFromUser, deleteSurvey, checkSurveyCompletion } from '../controllers/survey.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.post('/submit', verifyToken, submitSurvey);
router.get('/:userId', verifyToken, getSurveyFromUser);
router.delete('/delete-survey/:userId', verifyToken, deleteSurvey);
router.get('/check-completion/:userId', verifyToken, checkSurveyCompletion);

export default router;