import mongoose from 'mongoose';

const palateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipe_history: [{  // max 10
        recipeID: { type: String, required: true },
        recipe_name: { type: String, required: true }
    }],
    calorie_details: {
        current_calories: { type: Number, default: 0 },
        calorie_goal: { type: Number, default: 0 },
        date: { type: Date }
    },
    calories_this_week: [{ 
        day: { type: String },
        amount: { type: Number },
        dateUpdated: { type: Date }
    }],
    spending_details: {
        spending_total_this_week: { type: mongoose.Types.Decimal128, default: 0.0 },
        spending_this_year: { type: mongoose.Types.Decimal128, default: 0.0 },
        spending_this_month: { type: mongoose.Types.Decimal128, default: 0.0 },
        spending_this_week: [{ 
            day: { type: String },
            amount: { type: mongoose.Types.Decimal128, default: 0.0 },
            dateUpdated: { type: Date },
        }],
        spending_goal: { 
            lower_bound: { type: mongoose.Types.Decimal128, default: 0.0, required: true },
            upper_bound: { type: mongoose.Types.Decimal128, default: 0.0, required: true },
            budget: { type: mongoose.Types.Decimal128, default: 0.0, required: false}
        }
    },
    goal_type: {
        goal_type: { type: String }
    },
    dietary_preferences: {
        allergies: [{ type: String }],
        diet: [{ type: String }],
        ingredients: [{ type: String }]
    },
    misc: {
        cooking_frequency: { type: String },
        shopping_frequency: { type: String },
        prepping_frequency: { type: String },
        proficiency: { type: String }
    },
    appliances: [{ type: String }],
});

const Palate = mongoose.model('Palate', palateSchema);
export default Palate;