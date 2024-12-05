import express from 'express';
import {
    uploadRecipe,
    retrieveRecipes,
    updateCaloriesThisWeek,
    updateCalorieGoal,
    retrieveSpendingGoal,
    updateSpendingGoal,
    resetSpending,
    updateGoalType,
    getDietaryPreferences,
    updateDietaryPreferences,
    getMiscDetails,
    updateMiscDetails,
    getAppliances,
    updateAppliances,
    updatePalate,
    getPalate
} from '../controllers/userPalate.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.post('/update/:userId', verifyToken, updatePalate);
router.get('/palate/:userId', verifyToken, getPalate);

// routes for handling recipes
router.post('/upload-recipe/:userId', verifyToken, uploadRecipe);
router.get('/recipes/:userId', verifyToken, retrieveRecipes);

// routes for handling calorie details
router.post('/update-calories-this-week/:userId', verifyToken, updateCaloriesThisWeek);
router.put('/update-calorie-goal/:userId', verifyToken, updateCalorieGoal);

// routes for handling spending details
router.get('/spending-goal/:userId', verifyToken, retrieveSpendingGoal);
router.put('/update-spending-goal/:userId', verifyToken, updateSpendingGoal);
router.post('/reset-spending/:userId', verifyToken, resetSpending);

// route for updating goal type
router.put('/update-goal-type/:userId', verifyToken, updateGoalType);

// routes for Dietary Preferences
router.get('/dietary-preferences/:userId', verifyToken, getDietaryPreferences);
router.put('/dietary-preferences/:userId', verifyToken, updateDietaryPreferences);

// routes for Misc Details
router.get('/misc-details/:userId', verifyToken, getMiscDetails);
router.put('/misc-details/:userId', verifyToken, updateMiscDetails);

// routes for Appliances
router.get('/appliances/:userId', verifyToken, getAppliances);
router.put('/appliances/:userId', verifyToken, updateAppliances);

export default router;