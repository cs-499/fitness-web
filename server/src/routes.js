import express from 'express';
import { login, register } from './controllers/logging.js';
import { submitSurvey, getSurveyFromUser } from './controllers/survey.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/submit', submitSurvey);
router.get('/:userId', getSurveyFromUser);

export default router;