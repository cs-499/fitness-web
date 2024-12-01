import mongoose from 'mongoose';

const workoutPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  plan: { type: String, required: true },
});

const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);
export default WorkoutPlan;