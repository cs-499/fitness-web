import WorkoutPlan from '../models/createWorkout.js';

// Fetch workout excercises
export const getWorkoutPlansByDates = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Fetching excercises for userId: ${userId}`);

    const workoutPlans = await WorkoutPlan.find({ userId });

    const plansByDate = {};
    workoutPlans.forEach((plan) => {
      plansByDate[plan.date] = plan.plan;
    });

    res.json({ success: true, workoutPlans: plansByDate });
  } catch (error) {
    console.error('Error fetching excercises:', error);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

// Save workout excercises
export const saveWorkoutPlans = async (req, res) => {
  try {
    const { userId, plans } = req.body;

    for (const { date, plan } of plans) {
      const existingPlan = await WorkoutPlan.findOne({ userId, date });
      if (existingPlan) {
        existingPlan.plan = plan;
        await existingPlan.save();
      } else {
        await WorkoutPlan.create({ userId, date, plan });
      }
    }

    res.json({ success: true, message: 'Excercises saved successfully.' });
  } catch (error) {
    console.error('Error saving excercises:', error);
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};