const mongoose = require('mongoose');

const BodyMetricsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  weight: Number,
  bodyFat: Number,
  muscleMass: Number,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('BodyMetrics', BodyMetricsSchema);