const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  name: String,
  status: { type: String, enum: ['working', 'maintenance', 'broken'], default: 'working' },
  lastMaintenance: Date,
  nextMaintenance: Date,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Equipment', EquipmentSchema);