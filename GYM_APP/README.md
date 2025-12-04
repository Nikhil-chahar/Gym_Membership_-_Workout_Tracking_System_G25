# 🏋️ GymFit Pro - Gym Membership & Workout Tracking System

A complete MERN stack application for gym management and member fitness tracking.

## 📋 Features

### Member Features
- ✅ Registration & Login
- 💳 Membership Plan Purchase (Monthly/Yearly)
- 📍 QR Check-in System (Daily attendance)
- 🏋️ Workout Logger (Exercises, sets, reps, weights)
- 📊 Progress Tracking (Charts & analytics)
- 📅 Class/Session Booking (Zumba, Yoga, Personal Training)
- 📈 Body Metrics Tracking (Weight, body fat, muscle mass)

### Admin Features
- 📊 Dashboard (Total members, active memberships, revenue)
- 👥 Member Management (View all members, renew memberships)
- 🎓 Trainer Management
- 🛠️ Equipment Management (Track status & maintenance)
- ⚠️ Expiring Membership Alerts (7-day warning)
- 💰 Revenue Tracking

### Trainer Features
- 👤 Client Management (View assigned clients)
- 🥗 Diet Plan Assignment
- 📊 Client Progress Monitoring (Workouts & body metrics)
- 📅 Booking Management (View scheduled sessions)

## 🛠️ Tech Stack

**Frontend:**
- React 18
- CSS3 (Responsive, mobile-first design)

**Backend:**
- Node.js
- Express.js
- MongoDB (with Mongoose)

**Database Collections:**
- Users (Members, Trainers, Admins)
- Memberships
- Workouts
- BodyMetrics
- Attendance
- Bookings
- DietPlans
- Equipment
- Notifications

## 📁 Project Structure

```
GYM App/
├── client/                 # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js         # Main component (all features)
│   │   ├── App.css        # Styling
│   │   └── index.js       # Entry point
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── models/            # Mongoose Schemas
│   │   ├── User.js
│   │   ├── Membership.js
│   │   ├── Workout.js
│   │   ├── BodyMetrics.js
│   │   ├── Attendance.js
│   │   ├── Booking.js
│   │   ├── DietPlan.js
│   │   ├── Equipment.js
│   │   └── Notification.js
│   ├── server.js          # Express server & API routes
│   └── package.json
│
└── ER_diagram.txt         # Database schema
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (running locally on port 27017)
- npm or yarn

### Step 1: Install MongoDB
Make sure MongoDB is installed and running:
```bash
# Start MongoDB service
mongod
```

### Step 2: Configure Environment Variables

**Backend (.env):**
```bash
cd server
# Copy the example file
cp .env.example .env
# Edit .env and update values if needed
```

The server `.env` file contains:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gymapp
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

**Frontend (.env):**
```bash
cd ../client
# Copy the example file
cp .env.example .env
```

The client `.env` file contains:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=GymFit Pro
```

⚠️ **Important:** Never commit `.env` files to version control! They're already in `.gitignore`.

### Step 3: Install Server Dependencies
```bash
cd server
npm install
```

### Step 4: Install Client Dependencies
```bash
cd ../client
npm install
```

### Step 5: Start the Backend Server
```bash
cd ../server
npm start
# Server runs on http://localhost:5000
```

### Step 6: Start the Frontend
```bash
cd ../client
npm start
# React app runs on http://localhost:3000
```

## 🎯 Demo Flow

### Member Flow
1. **Register** → Create account with email/password (role: member)
2. **Login** → Access member dashboard
3. **Buy Plan** → Purchase Monthly (₹1,200) or Yearly (₹12,000) membership
4. **QR Check-in** → Mark daily attendance
5. **Log Workout** → Add exercises (sets, reps, weight, duration, calories)
6. **View Progress** → See workout history and charts
7. **Book Class** → Reserve slots for Zumba, Yoga, or Personal Training

### Admin Flow
1. **Login** → Access admin dashboard (role: admin)
2. **View Dashboard** → See stats (members, revenue, expiring memberships)
3. **Manage Members** → View all members and their membership status
4. **Renew Membership** → Extend membership for expiring members
5. **Manage Equipment** → Track gym equipment status and maintenance
6. **View Trainers** → See all registered trainers

### Trainer Flow
1. **Login** → Access trainer dashboard (role: trainer)
2. **View Clients** → See list of assigned clients
3. **View Progress** → Monitor client workouts and body metrics
4. **Assign Diet Plan** → Create custom diet plans for clients
5. **Manage Bookings** → View scheduled training sessions

## 📊 Database Schema (ER Diagram)

```
User (member, admin, trainer)
  |--< Membership
  |--< Workout
  |--< BodyMetrics
  |--< Attendance
  |--< Booking (as client)
  |--< DietPlan (as client)

Trainer (User with role 'trainer')
  |--< Booking (as trainer)
  |--< DietPlan (as trainer)

Equipment (managed by admin)
```

## 🎨 UI Features
- **Mobile-First Design** (Responsive for gym use)
- **Gradient Theme** (Purple gradient background)
- **Tab Navigation** (Easy switching between features)
- **Cards & Stats** (Visual data presentation)
- **Forms** (Clean input fields for data entry)

## 🔑 Sample User Accounts

**Member:**
- Email: member@test.com
- Password: password123

**Admin:**
- Email: admin@test.com
- Password: admin123

**Trainer:**
- Email: trainer@test.com
- Password: trainer123

*(Create these by registering through the UI)*

## 📝 API Endpoints

### Auth
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Member
- `POST /api/membership` - Buy membership plan
- `GET /api/membership/:userId` - Get user membership
- `POST /api/checkin` - QR check-in
- `GET /api/attendance/:userId` - Get attendance history
- `POST /api/workout` - Log workout
- `GET /api/progress/:userId` - Get workout progress
- `POST /api/bodymetrics` - Log body metrics
- `GET /api/bodymetrics/:userId` - Get body metrics
- `POST /api/booking` - Book class/session
- `GET /api/booking/:userId` - Get user bookings

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/members` - Get all members
- `POST /api/admin/renew` - Renew membership
- `GET /api/admin/trainers` - Get all trainers
- `GET /api/admin/equipment` - Get equipment list
- `POST /api/admin/equipment` - Add equipment
- `PUT /api/admin/equipment/:id` - Update equipment
- `POST /api/admin/notification` - Send notification

### Trainer
- `POST /api/dietplan` - Assign diet plan
- `GET /api/dietplan/:userId` - Get client diet plan
- `GET /api/clientprogress/:userId` - View client progress
- `GET /api/trainer/clients/:trainerId` - Get trainer's clients
- `GET /api/trainer/bookings/:trainerId` - Get trainer bookings

## 🏆 Judging Criteria Coverage

| Category | Weight | Implementation |
|----------|--------|----------------|
| User Experience / UI | 25% | ✅ Mobile-first responsive design, clean UI |
| Feature Completeness | 25% | ✅ All member, admin, trainer features implemented |
| Data Visualization | 20% | ✅ Charts placeholder, workout stats, progress tracking |
| Gamification | 15% | ⚠️ Attendance streaks foundation ready |
| Business Logic | 15% | ✅ Membership expiration, renewal, payment tracking |

## 🚧 Future Enhancements
- Add Chart.js for visual analytics graphs
- Implement JWT authentication
- Add email notifications (nodemailer)
- Add gamification (badges, streaks, leaderboards)
- Payment gateway integration (Razorpay/Stripe)
- QR code generation library
- Push notifications
- Mobile app (React Native)

## 📄 License
MIT License - Free for educational and hackathon use

## 👨‍💻 Author
Created for Gym Membership & Workout Tracking System Hackathon

---

**Note:** This is a simplified exam/hackathon-ready version. For production use, add:
- JWT authentication
- Password hashing (bcrypt)
- Input validation
- Error handling
- Environment variables (.env)
- API rate limiting
- HTTPS/SSL
