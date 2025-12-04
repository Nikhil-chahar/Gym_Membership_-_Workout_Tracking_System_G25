const mongoose = require('mongoose');

const MembershipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  planType: { type: String, enum: ['Monthly', 'Yearly'] },
  price: Number,
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ['active', 'expired', 'frozen'], default: 'active' },
  paymentId: String
}, { timestamps: true });

module.exports = mongoose.model('Membership', MembershipSchema);