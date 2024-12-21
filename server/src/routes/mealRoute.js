import express from 'express';
import {
    uploadRecipe,
    getRecipes,
    updateCurrentCalories,
    getCurrentCalories,
    updateCaloriesThisWeek,
    resetCurrentCalories,
    getCaloriesThisWeek,
    resetWeek,
    updateCalorieGoal,
    getCalorieGoal,
    getSpending,
    updateBudget,
    resetSpending,
    updateGoalType,
    getDietaryPreferences,
    updateDietaryPreferences,
    getMiscDetails,
    updateMiscDetails,
    getAppliances,
    updateAppliances,
    updatePalate,
    getPalate,
    resetBudget,
    resetSpendingComplete,
    updateSpendingThisWeek
} from '../controllers/userPalate.js';
import verifyToken from '../middleware/auth.js';

// app.use('/meals', mealRoute); // note /meals before frontend requests/submissions

const router = express.Router();

router.post('/update/:userId', verifyToken, updatePalate);
router.get('/palate/:userId', verifyToken, getPalate);

// routes for handling recipes
router.post('/upload-recipe/:userId', verifyToken, uploadRecipe);
router.get('/recipes/:userId', verifyToken, getRecipes);

// routes for handling calorie details
router.put('/update-current-calories/:userId', verifyToken, updateCurrentCalories);
router.put('/reset-current-calories/:userId', verifyToken, resetCurrentCalories);
router.get('/get-current-calories/:userId', verifyToken, getCurrentCalories);
router.post('/update-calories-this-week/:userId', verifyToken, updateCaloriesThisWeek);
router.get('/get-calories-this-week/:userId', verifyToken, getCaloriesThisWeek);
router.delete('/reset-week/:userId', verifyToken, resetWeek);
router.put('/update-calorie-goal/:userId', verifyToken, updateCalorieGoal);
router.get('/calorie-goal/:userId', verifyToken, getCalorieGoal);

// routes for handling spending details
router.get('/get-spending/:userId', verifyToken, getSpending);
router.put('/update-budget/:userId', verifyToken, updateBudget);
router.put('/reset-spending/:userId', verifyToken, resetSpending);
router.post('/reset-budget/:userId', verifyToken, resetBudget);
router.delete('/reset-spending-complete/:userId', verifyToken, resetSpendingComplete);
router.post('/update-spending-this-week/:userId', verifyToken, updateSpendingThisWeek);

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