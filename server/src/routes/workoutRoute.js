import express from 'express';
import { getWorkoutPlansByDates, saveWorkoutPlans } from '../controllers/workoutPlan.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/:userId', verifyToken, getWorkoutPlansByDates);
router.post('/', verifyToken, saveWorkoutPlans);

export default router;