const mongoose = require('mongoose');

const DietPlanSchema = new mongoose.Schema({
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  planName: String,
  planText: String,
  meals: [
    {
      mealType: String,
      items: [String],
      calories: Number
    }
  ],
  targetCalories: Number
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', DietPlanSchema);