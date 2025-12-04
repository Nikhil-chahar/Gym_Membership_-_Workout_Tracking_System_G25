const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  checkInTime: String,
  checkOutTime: String
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);