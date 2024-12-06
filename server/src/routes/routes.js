import express from 'express';
import { login, register } from '../controllers/logging.js';
<<<<<<< HEAD
=======
import { submitSurvey, getSurveyFromUser, deleteSurvey, checkSurveyCompletion } from '../controllers/survey.js';
>>>>>>> main
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
<<<<<<< HEAD
=======
router.post('/submit', verifyToken, submitSurvey);
router.get('/:userId', verifyToken, getSurveyFromUser);
router.delete('/delete-survey/:userId', verifyToken, deleteSurvey);
router.get('/check-completion/:userId', verifyToken, checkSurveyCompletion);
>>>>>>> main

export default router;