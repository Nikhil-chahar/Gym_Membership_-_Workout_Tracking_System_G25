const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  exercises: [
    {
      name: String,
      sets: Number,
      reps: Number,
      weight: Number,
      duration: Number // in minutes
    }
  ],
  totalDuration: Number,
  caloriesBurned: Number
}, { timestamps: true });

module.exports = mongoose.model('Workout', WorkoutSchema);