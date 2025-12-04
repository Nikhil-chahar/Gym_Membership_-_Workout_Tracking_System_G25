const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['member', 'admin', 'trainer'], default: 'member' },
  phone: String,
  profilePic: String,
  trainerBio: String,
  availability: [String] // For trainers
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);