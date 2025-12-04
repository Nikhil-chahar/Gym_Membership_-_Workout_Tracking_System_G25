const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  classType: { type: String, enum: ['Zumba', 'Yoga', 'PersonalTraining', 'Cardio', 'Strength'] },
  date: Date,
  time: String,
  status: { type: String, enum: ['booked', 'completed', 'cancelled'], default: 'booked' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);