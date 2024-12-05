import express from 'express';
import { login, register } from '../controllers/logging.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

export default router;