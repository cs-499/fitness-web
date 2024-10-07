import express from 'express';
import { login, register } from './controllers/logging.js';
import { submitSurvey, getSurveyByUserId } from './controllers/answerSurvey.js'

const router = express.Router();

// User login and register
router.post('/login', login);
router.post('/register', register);

// User survey page
router.post('/surveys/submit', submitSurvey);
router.get('/surveys/:userId', getSurveyByUserId);

export default router;