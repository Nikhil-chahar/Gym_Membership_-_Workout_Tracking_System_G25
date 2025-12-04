const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'gym-management-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Data storage file
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
function initDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    const defaultData = {
      users: [],
      owners: [],
      activities: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
  }
}

// Read data from file
function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [], owners: [], activities: [] };
  }
}

// Write data to file
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Initialize data file on startup
initDataFile();

// Create default owner account if none exists
function createDefaultOwner() {
  const data = readData();
  if (data.owners.length === 0) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    data.owners.push({
      id: 'owner1',
      username: 'admin',
      email: 'admin@gym.com',
      password: hashedPassword,
      name: 'Gym Owner'
    });
    writeData(data);
  }
}

createDefaultOwner();

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Authentication routes
app.post('/api/login', async (req, res) => {
  const { username, password, userType } = req.body;
  const data = readData();

  try {
    if (userType === 'owner') {
      const owner = data.owners.find(o => o.username === username || o.email === username);
      if (owner && bcrypt.compareSync(password, owner.password)) {
        req.session.userId = owner.id;
        req.session.userType = 'owner';
        req.session.username = owner.username;
        return res.json({ success: true, userType: 'owner', user: { id: owner.id, username: owner.username, name: owner.name } });
      }
    } else {
      const user = data.users.find(u => u.username === username || u.email === username);
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.userId = user.id;
        req.session.userType = 'user';
        req.session.username = user.username;
        return res.json({ success: true, userType: 'user', user: { id: user.id, username: user.username, name: user.name } });
      }
    }
    res.json({ success: false, message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, email, password, name, userType } = req.body;
  const data = readData();

  try {
    // Check if username or email already exists
    const existingUser = data.users.find(u => u.username === username || u.email === email);
    const existingOwner = data.owners.find(o => o.username === username || o.email === email);
    
    if (existingUser || existingOwner) {
      return res.json({ success: false, message: 'Username or email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newId = userType === 'owner' 
      ? `owner${Date.now()}` 
      : `user${Date.now()}`;

    const newUser = {
      id: newId,
      username,
      email,
      password: hashedPassword,
      name: name || username,
      createdAt: new Date().toISOString()
    };

    if (userType === 'owner') {
      data.owners.push(newUser);
    } else {
      data.users.push(newUser);
    }

    writeData(data);
    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get('/api/current-user', (req, res) => {
  if (req.session.userId) {
    const data = readData();
    let user;
    if (req.session.userType === 'owner') {
      user = data.owners.find(o => o.id === req.session.userId);
    } else {
      user = data.users.find(u => u.id === req.session.userId);
    }
    if (user) {
      return res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email
        },
        userType: req.session.userType
      });
    }
  }
  res.json({ success: false });
});

// Activity routes
app.get('/api/activities', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const data = readData();
  let activities = data.activities;

  // Users can only see their own activities
  if (req.session.userType === 'user') {
    activities = activities.filter(a => a.userId === req.session.userId);
  }

  res.json({ success: true, activities });
});

app.post('/api/activities', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const { activityType, description, duration, equipment, date } = req.body;
  const data = readData();

  const newActivity = {
    id: `activity${Date.now()}`,
    userId: req.session.userId,
    username: req.session.username,
    activityType: activityType || 'Workout',
    description: description || '',
    duration: duration || 0,
    equipment: equipment || '',
    date: date || new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  data.activities.push(newActivity);
  writeData(data);

  res.json({ success: true, activity: newActivity });
});

app.delete('/api/activities/:id', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const data = readData();
  const activityIndex = data.activities.findIndex(a => a.id === req.params.id);

  if (activityIndex === -1) {
    return res.status(404).json({ success: false, message: 'Activity not found' });
  }

  // Users can only delete their own activities, owners can delete any
  if (req.session.userType === 'user' && data.activities[activityIndex].userId !== req.session.userId) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  data.activities.splice(activityIndex, 1);
  writeData(data);

  res.json({ success: true });
});

// User management routes (owner only)
app.get('/api/users', (req, res) => {
  if (!req.session.userId || req.session.userType !== 'owner') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const data = readData();
  res.json({ success: true, users: data.users });
});

app.delete('/api/users/:id', (req, res) => {
  if (!req.session.userId || req.session.userType !== 'owner') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const data = readData();
  const userIndex = data.users.findIndex(u => u.id === req.params.id);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Also delete user's activities
  data.activities = data.activities.filter(a => a.userId !== req.params.id);
  data.users.splice(userIndex, 1);
  writeData(data);

  res.json({ success: true });
});

// Stats route (owner only)
app.get('/api/stats', (req, res) => {
  if (!req.session.userId || req.session.userType !== 'owner') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const data = readData();
  const stats = {
    totalUsers: data.users.length,
    totalActivities: data.activities.length,
    activitiesToday: data.activities.filter(a => {
      const today = new Date().toDateString();
      return new Date(a.date).toDateString() === today;
    }).length,
    activitiesThisWeek: data.activities.filter(a => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(a.date) >= weekAgo;
    }).length
  };

  res.json({ success: true, stats });
});

app.listen(PORT, () => {
  console.log(`Gym Management App running on http://localhost:${PORT}`);
});

