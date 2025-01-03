import mongoose from 'mongoose';
import Palate from '../models/createPalate.js';

/*
    uploadRecipe,
    getRecipes,
    updateCurrentCalories,
    getCurrentCalories,
    updateCaloriesThisWeek,
    getCaloriesThisWeek,
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
 */

// app.use('/meals', mealRoute); // note /meals before frontend requests/submissions

export const uploadRecipe = async (req, res) => {
    const { userId, newRecipe } = req.body;

    if (!userId || !newRecipe) {
        return res.status(400).json({ message: 'User ID and recipe details are required' });
    }

    try {
        const userPalate = await Palate.findOne({ userId });
        if (userPalate) {
            if (userPalate.recipe_history.length >= 10) {
                userPalate.recipe_history.shift();
            }

            userPalate.recipe_history.push({
                recipe_name: newRecipe.recipeName,
                recipeID: newRecipe.recipeID
            });

            await userPalate.save();
            res.status(201).json({ message: 'Recipe added successfully!', data: userPalate });
        } else {
            res.status(404).json({ message: 'User palate not found' });
        }
    } catch (error) {
        console.error('Error uploading recipe:', error);
        res.status(500).json({ message: 'Failed to upload recipe', error: error.message });
    }
};

export const getRecipes = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const userPalate = await Palate.findOne({ userId });
        if (userPalate) {
            res.status(200).json(userPalate.recipe_history);
        } else {
            res.status(404).json({ message: 'No recipes found for this user' });
        }
    } catch (error) {
        console.error('Error retrieving recipes:', error);
        res.status(500).json({ message: 'Failed to retrieve recipes', error: error.message });
    }
};

// update calories to be 0 each day in mealplan frontend
export const updateCurrentCalories = async (req, res) => {
    const { userId } = req.params;
    const { calories, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (calories === undefined || typeof calories !== 'number' || calories < 0) {
        return res.status(400).json({ message: 'Valid calorie value is required' });
    }

    try {
        const userPalate = await Palate.findOne({ userId });
        if (userPalate) {
            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });

            const dayEntry = userPalate.calories_this_week.find(entry => entry.day === dayName);
            if (dayEntry) {
                dayEntry.amount += calories;
                dayEntry.dateUpdated = date;
            } else {
                userPalate.calories_this_week.push({
                    day: dayName,
                    amount: calories,
                    dateUpdated: date
                });
            }

            if (calories > 0) {
                userPalate.calorie_details.date = date;
            }
            userPalate.calorie_details.current_calories += calories;

            await userPalate.save();

            res.status(200).json({
                message: 'Current calories updated successfully',
                data: userPalate.calorie_details,
                weekData: userPalate.calories_this_week
            });
        } else {
            res.status(404).json({ message: 'User palate not found' });
        }
    } catch (error) {
        console.error('Error updating current calories:', error.message, error.data);
        res.status(500).json({ message: 'Failed to update calories', error: error.message });
    }
};

export const resetCurrentCalories = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const userPalate = await Palate.findOne({ userId });
        if (userPalate) {
            // Reset current calories to 0 and update the date
            userPalate.calorie_details.current_calories = 0;
            userPalate.calorie_details.date = new Date();

            await userPalate.save();
            res.status(200).json({
                message: 'Current calories reset successfully',
                data: userPalate.calorie_details
            });
        } else {
            res.status(404).json({ message: 'User palate not found' });
        }
    } catch (error) {
        console.error('Error resetting current calories:', error);
        res.status(500).json({ message: 'Failed to reset current calories', error: error.message });
    }
};

export const getCurrentCalories = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const userPalate = await Palate.findOne({ userId });
        if (userPalate) {
            res.status(200).json({
                message: 'Current calories retrieved successfully',
                current_calories: userPalate.calorie_details.current_calories,
                date: userPalate.calorie_details.date
            });
        } else {
            res.status(404).json({ message: 'User palate not found' });
        }
    } catch (error) {
        console.error('Error retrieving current calories:', error);
        res.status(500).json({ message: 'Failed to retrieve current calories', error: error.message });
    }
};

// update calories to 0 for each day at beginning of each week in mealplan frontend
export const updateCaloriesThisWeek = async (req, res) => {
    const { userId } = req.params;
    const { day, amount, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (!day || amount === undefined || amount < 0) {
        return res.status(400).json({ message: 'Valid day and calorie amount are required' });
    }

    try {
        const userPalate = await Palate.findOne({ userId });
        if (userPalate) {
            // Check for an existing entry for the day
            const existingEntry = userPalate.calories_this_week.find(entry => entry.day === day);

            if (existingEntry) {
                // Update existing entry
                existingEntry.amount = amount;
                existingEntry.dateUpdated = date;
            } else {
                // Add new entry
                userPalate.calories_this_week.push({ day, amount, dateUpdated: date });
            }

            await userPalate.save();
            res.status(200).json({ message: 'Daily calories updated successfully', data: userPalate.calories_this_week });
        } else {
            res.status(404).json({ message: 'User palate not found' });
        }
    } catch (error) {
        console.error('Error updating daily calories:', error.message);
        res.status(500).json({ message: 'Failed to update daily calories', error: error.message });
    }
};

export const getCaloriesThisWeek = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const userPalate = await Palate.findOne({ userId });

        if (!userPalate) {
            return res.status(404).json({ message: 'User palate not found' });
        }

        const { calories_this_week } = userPalate;
        // console.log(calories_this_week.dateUpdated);

        res.status(200).json({
            message: 'Calories for this week retrieved successfully',
            data: calories_this_week,
        });
    } catch (error) {
        console.error('Error fetching weekly calories:', error);
        res.status(500).json({ message: 'Failed to fetch weekly calories', error: error.message });
    }
};

export const resetWeek = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const userPalate = await Palate.findOne({ userId });
        if (userPalate) {
            userPalate.calories_this_week = [];
            await userPalate.save();
            res.status(200).json({ message: 'Weekly calorie data reset successfully' });
        } else {
            res.status(404).json({ message: 'User palate not found' });
        }
    } catch (error) {
        console.error('Error resetting weekly calorie data:', error);
        res.status(500).json({ message: 'Failed to reset weekly calorie data', error: error.message });
    }
};

export const updateCalorieGoal = async (req, res) => {
    const { userId } = req.params;
    const { newCalorieGoal } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const result = await Palate.findOneAndUpdate(
            { "userId" : userId },
            { "calorie_details.calorie_goal": newCalorieGoal },
            { new: true }
        );

        if (result) {
            res.status(200).json({ message: 'Calorie goal updated successfully', data: result.calorie_details });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating calorie goal:', error);
        res.status(500).json({ message: 'Failed to update calorie goal', error: error.message });
    }
};

export const getCalorieGoal = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const userPalate = await Palate.findOne({ userId });
        if (userPalate && userPalate.calorie_details && userPalate.calorie_details.calorie_goal !== undefined) {
            res.status(200).json({ calorieGoal: userPalate.calorie_details.calorie_goal });
        } else {
            res.status(404).json({ message: 'Calorie goal not found' });
        }
    } catch (error) {
        console.error('Error retrieving calorie goal:', error);
        res.status(500).json({ message: 'Failed to retrieve calorie goal', error: error.message });
    }
};

export const getSpending = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const userPalate = await Palate.findOne({ userId });
        if (userPalate && userPalate.spending_details.spending_goal) {
            res.status(200).json({ all_spending: userPalate.spending_details});
        } else {
            res.status(404).json({ message: 'No spending goal found for this user' });
        }
    } catch (error) {
        console.error('Error retrieving spending goal:', error);
        res.status(500).json({ message: 'Failed to retrieve spending goal', error: error.message });
    }
};

export const updateBudget = async (req, res) => {
    const { userId } = req.params;
    const { budget } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    if (budget === undefined) {
        return res.status(400).json({ message: 'Budget is required' });
    }

    try {
        const result = await Palate.findOne({ userId });

        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (result.spending_details.spending_goal.lower_bound != 0.0 && result.spending_details.spending_goal.upper_bound != 0.0) {
            result.spending_details.spending_goal.budget = mongoose.Types.Decimal128.fromString(budget.toString());
            result.spending_details.spending_goal.lower_bound = 0.0;
            result.spending_details.spending_goal.upper_bound = 0.0;
        } else {
            result.spending_details.spending_goal.budget = mongoose.Types.Decimal128.fromString(budget.toString());
        }

        await result.save();

        res.status(200).json({ message: 'Budget updated successfully', data: result.spending_details.spending_goal });
    } catch (error) {
        console.error('Error updating budget:', error);
        res.status(500).json({ message: 'Failed to update budget', error: error.message });
    }
};

export const resetBudget = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const userPalate = await Palate.findOne({ userId });
        if (!userPalate) {
            return res.status(404).json({ message: 'User not found' });
        }

        userPalate.spending_details.spending_goal.lower_bound = mongoose.Types.Decimal128.fromString('0.0');
        userPalate.spending_details.spending_goal.upper_bound = mongoose.Types.Decimal128.fromString('0.0');
        userPalate.spending_details.spending_goal.budget = mongoose.Types.Decimal128.fromString('0.0');

        await userPalate.save();
        res.status(200).json({ message: 'Budget reset successfully' });
    } catch (error) {
        console.error('Error resetting budget:', error);
        res.status(500).json({ message: 'Failed to reset budget', error: error.message });
    }
};

export const updateSpendingThisWeek = async (req, res) => {
    const { userId } = req.params;
    const { day, spending, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (!day || !spending || !date) {
        return res.status(400).json({ message: 'Missing required fields: day, spending, or date' });
    }

    try {
        const userPalate = await Palate.findOne({ userId });

        if (!userPalate) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const spendingAmount = mongoose.Types.Decimal128.fromString(spending.toString());
        const parsedDate = new Date(date);

        // update spending_this_week
        const existingEntry = userPalate.spending_details.spending_this_week.find(entry => entry.day === day);

        if (existingEntry) {
            // update existing entry
            existingEntry.amount = mongoose.Types.Decimal128.fromString(
                (parseFloat(existingEntry.amount.toString()) + parseFloat(spendingAmount.toString())).toFixed(2)
            );
            existingEntry.dateUpdated = parsedDate;
        } else {
            // push a new entry
            userPalate.spending_details.spending_this_week.push({ day, amount: spendingAmount, dateUpdated: parsedDate });

            // ensure a maximum of 7 entries
            if (userPalate.spending_details.spending_this_week.length > 7) {
                userPalate.spending_details.spending_this_week.shift();
            }
        }

        // update spending_this_year and spending_this_month
        userPalate.spending_details.spending_this_year = mongoose.Types.Decimal128.fromString(
            (parseFloat(userPalate.spending_details.spending_this_year.toString()) + parseFloat(spendingAmount.toString())).toFixed(2)
        );

        userPalate.spending_details.spending_this_month = mongoose.Types.Decimal128.fromString(
            (parseFloat(userPalate.spending_details.spending_this_month.toString()) + parseFloat(spendingAmount.toString())).toFixed(2)
        );

        // calculate spending_total_this_week
        userPalate.spending_details.spending_total_this_week = mongoose.Types.Decimal128.fromString(
            userPalate.spending_details.spending_this_week.reduce((total, entry) => {
                return total + parseFloat(entry.amount.toString());
            }, 0).toFixed(2)
        );

        await userPalate.save();

        res.status(200).json({ message: 'Spending updated successfully', spendingDetails: userPalate.spending_details });
    } catch (error) {
        console.error('Error updating spending:', error);
        res.status(500).json({ message: 'Failed to update spending', error: error.message });
    }
};

// call this function at the beginning of each week in mealplan front end
export const resetSpending = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const userPalate = await Palate.findOne({ userId });
        if (userPalate) {
            userPalate.spending_details.spending_total_this_week = mongoose.Types.Decimal128.fromString(0);
            userPalate.spending_details.spending_this_week = [];

            await userPalate.save();
            res.status(200).json({ message: 'Spending reset successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error resetting spending:', error);
        res.status(500).json({ message: 'Failed to reset spending', error: error.message });
    }
};

export const resetSpendingComplete = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const userPalate = await Palate.findOne({ userId });
        if (userPalate) {
            userPalate.spending_details = {
                spending_total_this_week: mongoose.Types.Decimal128.fromString("0.0"),
                spending_this_year: mongoose.Types.Decimal128.fromString("0.0"),
                spending_this_month: mongoose.Types.Decimal128.fromString("0.0"),
                spending_this_week: [],
                spending_goal: {
                    lower_bound: mongoose.Types.Decimal128.fromString("0.0"),
                    upper_bound: mongoose.Types.Decimal128.fromString("0.0"),
                    budget: mongoose.Types.Decimal128.fromString("0.0"),
                },
            };
        }
        await userPalate.save();
    } catch (error) {
        console.error("Error resetting all spending: ", error);
    }
}

export const updateGoalType = async (req, res) => {
    const { userId, newGoalType } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const result = await Palate.findOneAndUpdate(
            { userId },
            { "goal_type.goal_type": newGoalType },
            { new: true }
        );

        if (result) {
            res.status(200).json({ message: 'Goal type updated successfully', data: result.goal_type });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating goal type:', error);
        res.status(500).json({ message: 'Failed to update goal type', error: error.message });
    }
};

export const getDietaryPreferences = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const userPalate = await Palate.findOne({ userId });
        if (userPalate) {
            res.status(200).json({ dietary_preferences: userPalate.dietary_preferences });
        } else {
            res.status(404).json({ message: 'User palate not found' });
        }
    } catch (error) {
        console.error('Error retrieving dietary preferences:', error);
        res.status(500).json({ message: 'Failed to retrieve dietary preferences', error: error.message });
    }
};

export const getMiscDetails = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const userPalate = await Palate.findOne({ userId });
        if (userPalate) {
            res.status(200).json({ misc: userPalate.misc });
        } else {
            res.status(404).json({ message: 'User palate not found' });
        }
    } catch (error) {
        console.error('Error retrieving misc details:', error);
        res.status(500).json({ message: 'Failed to retrieve misc details', error: error.message });
    }
};

export const getAppliances = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const userPalate = await Palate.findOne({ userId });
        if (userPalate) {
            res.status(200).json({ appliances: userPalate.appliances });
        } else {
            res.status(404).json({ message: 'User palate not found' });
        }
    } catch (error) {
        console.error('Error retrieving appliances:', error);
        res.status(500).json({ message: 'Failed to retrieve appliances', error: error.message });
    }
};

export const updateDietaryPreferences = async (req, res) => {
    const { userId } = req.params;
    const { allergies, diet, ingredients } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const result = await Palate.findOneAndUpdate(
            { userId },
            { "dietary_preferences": { allergies, diet, ingredients } },
            { new: true }
        );

        if (result) {
            res.status(200).json({ message: 'Dietary preferences updated successfully', data: result.dietary_preferences });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating dietary preferences:', error);
        res.status(500).json({ message: 'Failed to update dietary preferences', error: error.message });
    }
};

export const updateMiscDetails = async (req, res) => {
    const { userId } = req.params;
    const { cooking_frequency, shopping_frequency, prepping_frequency, proficiency } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const result = await Palate.findOneAndUpdate(
            { userId },
            { "misc": { cooking_frequency, shopping_frequency, prepping_frequency, proficiency } },
            { new: true }
        );

        if (result) {
            res.status(200).json({ message: 'Misc details updated successfully', data: result.misc });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating misc details:', error);
        res.status(500).json({ message: 'Failed to update misc details', error: error.message });
    }
};

export const updateAppliances = async (req, res) => {
    const { userId } = req.params;
    const { appliances } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const result = await Palate.findOneAndUpdate(
            { userId },
            { "appliances": appliances },
            { new: true }
        );

        if (result) {
            res.status(200).json({ message: 'Appliances updated successfully', data: result.appliances });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating appliances:', error);
        res.status(500).json({ message: 'Failed to update appliances', error: error.message });
    }
};

export const updatePalate = async (req, res) => {
    const { userId } = req.params;
    const { dietary_preferences, misc, appliances, spending_details, goal_type } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const update = {
            dietary_preferences,
            misc,
            appliances,
            spending_details,
            goal_type
        };

        const updateOptions = {
            new: true,
            upsert: true, 
            setDefaultsOnInsert: true 
        };

        const palate = await Palate.findOneAndUpdate({ userId }, update, updateOptions);

        if (!palate) {
            return res.status(404).json({ message: 'Palate not found and creation failed' });
        }

        res.status(200).json({ message: 'Palate updated successfully', data: palate });
    } catch (error) {
        console.error('Error updating or creating Palate:', error);
        res.status(500).json({ message: 'Failed to update or create Palate', error: error.message });
    }
};

export const getPalate = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const userPalate = await Palate.findOne({ userId });
        if (userPalate) {
            res.status(200).json(userPalate);
        } else {
            res.status(404).json({ message: 'Palate not found' });
        }
    } catch (error) {
        console.error('Error retrieving palate:', error);
        res.status(500).json({ message: 'Failed to retrieve palate', error: error.message });
    }
};