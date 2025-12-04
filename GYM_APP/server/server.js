require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require('./models/User');
const Membership = require('./models/Membership');
const Workout = require('./models/Workout');
const DietPlan = require('./models/DietPlan');
const Attendance = require('./models/Attendance');
const BodyMetrics = require('./models/BodyMetrics');
const Booking = require('./models/Booking');
const Equipment = require('./models/Equipment');
const Notification = require('./models/Notification');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gymapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// ============ AUTH ROUTES ============
// Register
app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = new User({ name, email, password, role });
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login (simple, no JWT for exam)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// ============ MEMBER ROUTES ============
// Buy Membership
app.post('/api/membership', async (req, res) => {
  const { userId, planType } = req.body;
  const startDate = new Date();
  const endDate = new Date();
  const price = planType === 'Yearly' ? 12000 : 1200;
  endDate.setMonth(endDate.getMonth() + (planType === 'Yearly' ? 12 : 1));
  const membership = new Membership({ userId, planType, price, startDate, endDate, status: 'active', paymentId: 'MOCK_PAY_' + Date.now() });
  await membership.save();
  res.json({ success: true, membership });
});

// Get User Membership
app.get('/api/membership/:userId', async (req, res) => {
  const { userId } = req.params;
  const membership = await Membership.findOne({ userId, status: 'active' });
  res.json({ membership });
});

// QR Check-in (simulate)
app.post('/api/checkin', async (req, res) => {
  const { userId } = req.body;
  const today = new Date().toDateString();
  const existingCheckin = await Attendance.findOne({ 
    userId, 
    date: { $gte: new Date(today) } 
  });
  
  if (existingCheckin) {
    return res.status(400).json({ error: 'Already checked in today' });
  }
  
  const attendance = new Attendance({ userId, date: new Date(), checkInTime: new Date().toLocaleTimeString() });
  await attendance.save();
  res.json({ success: true, message: 'Checked in successfully!' });
});

// Get Attendance Stats (for streak calculation)
app.get('/api/attendance/:userId', async (req, res) => {
  const { userId } = req.params;
  const attendance = await Attendance.find({ userId }).sort({ date: -1 }).limit(30);
  res.json({ attendance });
});

// Log Workout
app.post('/api/workout', async (req, res) => {
  const { userId, exercises, totalDuration, caloriesBurned } = req.body;
  const workout = new Workout({ userId, date: new Date(), exercises, totalDuration, caloriesBurned });
  await workout.save();
  res.json({ success: true, workout });
});

// View Progress (get workouts)
app.get('/api/progress/:userId', async (req, res) => {
  const { userId } = req.params;
  const workouts = await Workout.find({ userId }).sort({ date: -1 });
  res.json({ workouts });
});

// Log Body Metrics
app.post('/api/bodymetrics', async (req, res) => {
  const { userId, weight, bodyFat, muscleMass, notes } = req.body;
  const metrics = new BodyMetrics({ userId, weight, bodyFat, muscleMass, notes });
  await metrics.save();
  res.json({ success: true, metrics });
});

// Get Body Metrics
app.get('/api/bodymetrics/:userId', async (req, res) => {
  const { userId } = req.params;
  const metrics = await BodyMetrics.find({ userId }).sort({ date: -1 });
  res.json({ metrics });
});

// Book a Class/Session
app.post('/api/booking', async (req, res) => {
  const { userId, trainerId, classType, date, time } = req.body;
  const booking = new Booking({ userId, trainerId, classType, date, time });
  await booking.save();
  res.json({ success: true, booking });
});

// Get User Bookings
app.get('/api/booking/:userId', async (req, res) => {
  const { userId } = req.params;
  const bookings = await Booking.find({ userId }).populate('trainerId', 'name').sort({ date: -1 });
  res.json({ bookings });
});

// ============ ADMIN ROUTES ============
// Dashboard Stats
app.get('/api/admin/dashboard', async (req, res) => {
  const totalMembers = await User.countDocuments({ role: 'member' });
  const activeMembers = await Membership.countDocuments({ status: 'active' });
  const expiringMembers = await Membership.find({ 
    endDate: { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    status: 'active'
  }).populate('userId', 'name email');
  
  const memberships = await Membership.find({ status: 'active' });
  const revenue = memberships.reduce((sum, m) => sum + (m.price || 0), 0);
  
  res.json({ totalMembers, activeMembers, expiringMembers, revenue });
});

// Get All Members
app.get('/api/admin/members', async (req, res) => {
  const members = await User.find({ role: 'member' });
  const membersWithPlan = await Promise.all(members.map(async (member) => {
    const membership = await Membership.findOne({ userId: member._id, status: 'active' });
    return { ...member.toObject(), membership };
  }));
  res.json({ members: membersWithPlan });
});

// Renew Membership
app.post('/api/admin/renew', async (req, res) => {
  const { membershipId, planType } = req.body;
  const membership = await Membership.findById(membershipId);
  if (!membership) return res.status(404).json({ error: 'Membership not found' });
  
  const newEndDate = new Date(membership.endDate);
  newEndDate.setMonth(newEndDate.getMonth() + (planType === 'Yearly' ? 12 : 1));
  membership.endDate = newEndDate;
  membership.status = 'active';
  await membership.save();
  
  res.json({ success: true, membership });
});

// Get All Trainers
app.get('/api/admin/trainers', async (req, res) => {
  const trainers = await User.find({ role: 'trainer' });
  res.json({ trainers });
});

// Equipment Management
app.get('/api/admin/equipment', async (req, res) => {
  const equipment = await Equipment.find();
  res.json({ equipment });
});

app.post('/api/admin/equipment', async (req, res) => {
  const { name, status, lastMaintenance, nextMaintenance, notes } = req.body;
  const equipment = new Equipment({ name, status, lastMaintenance, nextMaintenance, notes });
  await equipment.save();
  res.json({ success: true, equipment });
});

app.put('/api/admin/equipment/:id', async (req, res) => {
  const { id } = req.params;
  const equipment = await Equipment.findByIdAndUpdate(id, req.body, { new: true });
  res.json({ success: true, equipment });
});

// Send Notification
app.post('/api/admin/notification', async (req, res) => {
  const { userId, type, message } = req.body;
  const notification = new Notification({ userId, type, message });
  await notification.save();
  res.json({ success: true });
});

// ============ TRAINER ROUTES ============
// Assign Diet Plan
app.post('/api/dietplan', async (req, res) => {
  const { trainerId, userId, planName, planText, meals, targetCalories } = req.body;
  const dietPlan = new DietPlan({ trainerId, userId, planName, planText, meals, targetCalories });
  await dietPlan.save();
  res.json({ success: true, dietPlan });
});

// Get Client's Diet Plan
app.get('/api/dietplan/:userId', async (req, res) => {
  const { userId } = req.params;
  const dietPlan = await DietPlan.findOne({ userId }).populate('trainerId', 'name');
  res.json({ dietPlan });
});

// View Client Progress (trainer)
app.get('/api/clientprogress/:userId', async (req, res) => {
  const { userId } = req.params;
  const workouts = await Workout.find({ userId }).sort({ date: -1 });
  const bodyMetrics = await BodyMetrics.find({ userId }).sort({ date: -1 });
  const user = await User.findById(userId);
  res.json({ user, workouts, bodyMetrics });
});

// Get Trainer's Clients (members who have bookings with this trainer)
app.get('/api/trainer/clients/:trainerId', async (req, res) => {
  const { trainerId } = req.params;
  const bookings = await Booking.find({ trainerId }).populate('userId', 'name email');
  const uniqueClients = [...new Map(bookings.map(b => [b.userId._id.toString(), b.userId])).values()];
  res.json({ clients: uniqueClients });
});

// Get Trainer Bookings
app.get('/api/trainer/bookings/:trainerId', async (req, res) => {
  const { trainerId } = req.params;
  const bookings = await Booking.find({ trainerId }).populate('userId', 'name').sort({ date: -1 });
  res.json({ bookings });
});

// Update Trainer Availability
app.put('/api/trainer/availability/:trainerId', async (req, res) => {
  const { trainerId } = req.params;
  const { availability } = req.body;
  const trainer = await User.findByIdAndUpdate(trainerId, { availability }, { new: true });
  res.json({ success: true, trainer });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});