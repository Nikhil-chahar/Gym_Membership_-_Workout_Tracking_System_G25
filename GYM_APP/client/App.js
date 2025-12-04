import React, { useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');

  const handleLogout = () => {
    setUser(null);
    setView('login');
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🏋️ GymFit Pro</h1>
        {user && (
          <div className="user-info">
            <span>Welcome, {user.name} ({user.role})</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        )}
      </header>

      {!user ? (
        <Auth setUser={setUser} setView={setView} />
      ) : (
        <div>
          {user.role === 'member' && <MemberDashboard user={user} />}
          {user.role === 'admin' && <AdminDashboard user={user} />}
          {user.role === 'trainer' && <TrainerDashboard user={user} />}
        </div>
      )}
    </div>
  );
}

// ============ AUTH COMPONENT ============
function Auth({ setUser, setView }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'member' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/register';
    try {
      const res = await fetch(API_URL + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        alert(isLogin ? 'Login successful!' : 'Registration successful!');
      } else {
        alert(data.error || 'Error occurred');
      }
    } catch (err) {
      alert('Server error');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          {!isLogin && (
            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="member">Member</option>
              <option value="trainer">Trainer</option>
              <option value="admin">Admin</option>
            </select>
          )}
          <button type="submit" className="btn-primary">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <p className="toggle-auth">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Register' : 'Login'}</span>
        </p>
      </div>
    </div>
  );
}

// ============ MEMBER DASHBOARD ============
function MemberDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="dashboard">
      <nav className="tabs">
        <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'active' : ''}>Home</button>
        <button onClick={() => setActiveTab('membership')} className={activeTab === 'membership' ? 'active' : ''}>Membership</button>
        <button onClick={() => setActiveTab('checkin')} className={activeTab === 'checkin' ? 'active' : ''}>Check-in</button>
        <button onClick={() => setActiveTab('workout')} className={activeTab === 'workout' ? 'active' : ''}>Log Workout</button>
        <button onClick={() => setActiveTab('progress')} className={activeTab === 'progress' ? 'active' : ''}>Progress</button>
        <button onClick={() => setActiveTab('booking')} className={activeTab === 'booking' ? 'active' : ''}>Book Class</button>
      </nav>

      <div className="tab-content">
        {activeTab === 'home' && <MemberHome user={user} />}
        {activeTab === 'membership' && <Membership user={user} />}
        {activeTab === 'checkin' && <CheckIn user={user} />}
        {activeTab === 'workout' && <WorkoutLogger user={user} />}
        {activeTab === 'progress' && <Progress user={user} />}
        {activeTab === 'booking' && <Booking user={user} />}
      </div>
    </div>
  );
}

function MemberHome({ user }) {
  return (
    <div className="section">
      <h2>Welcome, {user.name}! 💪</h2>
      <p>Track your fitness journey with GymFit Pro</p>
      <div className="stats-grid">
        <div className="stat-card">📅 Daily Check-ins</div>
        <div className="stat-card">🏋️ Workouts Logged</div>
        <div className="stat-card">📊 Progress Tracking</div>
        <div className="stat-card">🎯 Goals Achieved</div>
      </div>
    </div>
  );
}

function Membership({ user }) {
  const [membership, setMembership] = useState(null);
  const [planType, setPlanType] = useState('Monthly');

  const fetchMembership = async () => {
    const res = await fetch(`${API_URL}/membership/${user._id}`);
    const data = await res.json();
    setMembership(data.membership);
  };

  const buyPlan = async () => {
    const res = await fetch(`${API_URL}/membership`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, planType })
    });
    const data = await res.json();
    if (data.success) {
      alert('Membership purchased successfully!');
      fetchMembership();
    }
  };

  React.useEffect(() => {
    fetchMembership();
  }, []);

  return (
    <div className="section">
      <h2>💳 Membership</h2>
      {membership ? (
        <div className="membership-info">
          <p><strong>Plan:</strong> {membership.planType}</p>
          <p><strong>Status:</strong> {membership.status}</p>
          <p><strong>Valid Until:</strong> {new Date(membership.endDate).toLocaleDateString()}</p>
          <p><strong>Price:</strong> ₹{membership.price}</p>
        </div>
      ) : (
        <div>
          <h3>Buy Membership Plan</h3>
          <select value={planType} onChange={(e) => setPlanType(e.target.value)}>
            <option value="Monthly">Monthly - ₹1,200</option>
            <option value="Yearly">Yearly - ₹12,000</option>
          </select>
          <button onClick={buyPlan} className="btn-primary">Purchase</button>
        </div>
      )}
    </div>
  );
}

function CheckIn({ user }) {
  const [message, setMessage] = useState('');
  const [attendance, setAttendance] = useState([]);

  const handleCheckIn = async () => {
    const res = await fetch(`${API_URL}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id })
    });
    const data = await res.json();
    if (data.success) {
      setMessage(data.message);
      fetchAttendance();
    } else {
      setMessage(data.error);
    }
  };

  const fetchAttendance = async () => {
    const res = await fetch(`${API_URL}/attendance/${user._id}`);
    const data = await res.json();
    setAttendance(data.attendance);
  };

  React.useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="section">
      <h2>📍 QR Check-in</h2>
      <div className="qr-box">
        <div className="qr-code">📱 QR Code Here</div>
        <button onClick={handleCheckIn} className="btn-primary">Check In</button>
        {message && <p className="message">{message}</p>}
      </div>
      <h3>Recent Attendance ({attendance.length} days)</h3>
      <div className="attendance-list">
        {attendance.slice(0, 7).map((a, i) => (
          <div key={i} className="attendance-item">
            ✅ {new Date(a.date).toLocaleDateString()} - {a.checkInTime}
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkoutLogger({ user }) {
  const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '', weight: '' }]);
  const [totalDuration, setTotalDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', weight: '' }]);
  };

  const updateExercise = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const logWorkout = async () => {
    const res = await fetch(`${API_URL}/workout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, exercises, totalDuration: parseInt(totalDuration), caloriesBurned: parseInt(caloriesBurned) })
    });
    const data = await res.json();
    if (data.success) {
      alert('Workout logged successfully!');
      setExercises([{ name: '', sets: '', reps: '', weight: '' }]);
      setTotalDuration('');
      setCaloriesBurned('');
    }
  };

  return (
    <div className="section">
      <h2>🏋️ Log Workout</h2>
      {exercises.map((ex, i) => (
        <div key={i} className="exercise-row">
          <input placeholder="Exercise" value={ex.name} onChange={(e) => updateExercise(i, 'name', e.target.value)} />
          <input placeholder="Sets" type="number" value={ex.sets} onChange={(e) => updateExercise(i, 'sets', e.target.value)} />
          <input placeholder="Reps" type="number" value={ex.reps} onChange={(e) => updateExercise(i, 'reps', e.target.value)} />
          <input placeholder="Weight (kg)" type="number" value={ex.weight} onChange={(e) => updateExercise(i, 'weight', e.target.value)} />
        </div>
      ))}
      <button onClick={addExercise} className="btn-secondary">+ Add Exercise</button>
      <div className="workout-summary">
        <input placeholder="Total Duration (min)" type="number" value={totalDuration} onChange={(e) => setTotalDuration(e.target.value)} />
        <input placeholder="Calories Burned" type="number" value={caloriesBurned} onChange={(e) => setCaloriesBurned(e.target.value)} />
      </div>
      <button onClick={logWorkout} className="btn-primary">Log Workout</button>
    </div>
  );
}

function Progress({ user }) {
  const [workouts, setWorkouts] = useState([]);

  const fetchProgress = async () => {
    const res = await fetch(`${API_URL}/progress/${user._id}`);
    const data = await res.json();
    setWorkouts(data.workouts);
  };

  React.useEffect(() => {
    fetchProgress();
  }, []);

  return (
    <div className="section">
      <h2>📊 Progress Tracking</h2>
      <p>Total Workouts: {workouts.length}</p>
      <div className="chart-placeholder">
        📈 Chart: Workout Progress Over Time
        <p>(Integrate Chart.js here for visual analytics)</p>
      </div>
      <h3>Recent Workouts</h3>
      {workouts.slice(0, 5).map((w, i) => (
        <div key={i} className="workout-card">
          <p><strong>{new Date(w.date).toLocaleDateString()}</strong></p>
          <p>Exercises: {w.exercises.length} | Duration: {w.totalDuration}min | Calories: {w.caloriesBurned}</p>
        </div>
      ))}
    </div>
  );
}

function Booking({ user }) {
  const [classType, setClassType] = useState('Zumba');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [bookings, setBookings] = useState([]);

  const bookClass = async () => {
    const res = await fetch(`${API_URL}/booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, classType, date, time })
    });
    const data = await res.json();
    if (data.success) {
      alert('Booking successful!');
      fetchBookings();
    }
  };

  const fetchBookings = async () => {
    const res = await fetch(`${API_URL}/booking/${user._id}`);
    const data = await res.json();
    setBookings(data.bookings);
  };

  React.useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="section">
      <h2>📅 Book Class/Session</h2>
      <select value={classType} onChange={(e) => setClassType(e.target.value)}>
        <option value="Zumba">Zumba</option>
        <option value="Yoga">Yoga</option>
        <option value="PersonalTraining">Personal Training</option>
        <option value="Cardio">Cardio</option>
        <option value="Strength">Strength</option>
      </select>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      <button onClick={bookClass} className="btn-primary">Book Now</button>

      <h3>My Bookings</h3>
      {bookings.map((b, i) => (
        <div key={i} className="booking-card">
          <p><strong>{b.classType}</strong> - {new Date(b.date).toLocaleDateString()} at {b.time}</p>
          <p>Status: {b.status}</p>
        </div>
      ))}
    </div>
  );
}

// ============ ADMIN DASHBOARD ============
function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="dashboard">
      <nav className="tabs">
        <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>Dashboard</button>
        <button onClick={() => setActiveTab('members')} className={activeTab === 'members' ? 'active' : ''}>Members</button>
        <button onClick={() => setActiveTab('trainers')} className={activeTab === 'trainers' ? 'active' : ''}>Trainers</button>
        <button onClick={() => setActiveTab('equipment')} className={activeTab === 'equipment' ? 'active' : ''}>Equipment</button>
      </nav>

      <div className="tab-content">
        {activeTab === 'dashboard' && <AdminDashboardView />}
        {activeTab === 'members' && <MembersManagement />}
        {activeTab === 'trainers' && <TrainersManagement />}
        {activeTab === 'equipment' && <EquipmentManagement />}
      </div>
    </div>
  );
}

function AdminDashboardView() {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    const res = await fetch(`${API_URL}/admin/dashboard`);
    const data = await res.json();
    setStats(data);
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="section">
      <h2>📊 Admin Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalMembers}</h3>
          <p>Total Members</p>
        </div>
        <div className="stat-card">
          <h3>{stats.activeMembers}</h3>
          <p>Active Memberships</p>
        </div>
        <div className="stat-card">
          <h3>₹{stats.revenue}</h3>
          <p>Total Revenue</p>
        </div>
        <div className="stat-card">
          <h3>{stats.expiringMembers.length}</h3>
          <p>Expiring Soon</p>
        </div>
      </div>

      <h3>⚠️ Expiring Memberships (Next 7 Days)</h3>
      {stats.expiringMembers.map((m, i) => (
        <div key={i} className="member-card">
          <p><strong>{m.userId.name}</strong> ({m.userId.email})</p>
          <p>Expires: {new Date(m.endDate).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

function MembersManagement() {
  const [members, setMembers] = useState([]);

  const fetchMembers = async () => {
    const res = await fetch(`${API_URL}/admin/members`);
    const data = await res.json();
    setMembers(data.members);
  };

  const renewMembership = async (membershipId) => {
    const planType = prompt('Enter plan type (Monthly/Yearly):');
    if (!planType) return;
    const res = await fetch(`${API_URL}/admin/renew`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ membershipId, planType })
    });
    const data = await res.json();
    if (data.success) {
      alert('Membership renewed!');
      fetchMembers();
    }
  };

  React.useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="section">
      <h2>👥 Members Management</h2>
      {members.map((m, i) => (
        <div key={i} className="member-card">
          <p><strong>{m.name}</strong> ({m.email})</p>
          {m.membership ? (
            <div>
              <p>Plan: {m.membership.planType} | Status: {m.membership.status}</p>
              <p>Expires: {new Date(m.membership.endDate).toLocaleDateString()}</p>
              <button onClick={() => renewMembership(m.membership._id)} className="btn-secondary">Renew</button>
            </div>
          ) : (
            <p>No active membership</p>
          )}
        </div>
      ))}
    </div>
  );
}

function TrainersManagement() {
  const [trainers, setTrainers] = useState([]);

  const fetchTrainers = async () => {
    const res = await fetch(`${API_URL}/admin/trainers`);
    const data = await res.json();
    setTrainers(data.trainers);
  };

  React.useEffect(() => {
    fetchTrainers();
  }, []);

  return (
    <div className="section">
      <h2>🎓 Trainers Management</h2>
      {trainers.map((t, i) => (
        <div key={i} className="trainer-card">
          <p><strong>{t.name}</strong> ({t.email})</p>
          <p>Bio: {t.trainerBio || 'N/A'}</p>
        </div>
      ))}
    </div>
  );
}

function EquipmentManagement() {
  const [equipment, setEquipment] = useState([]);
  const [newEquip, setNewEquip] = useState({ name: '', status: 'working', notes: '' });

  const fetchEquipment = async () => {
    const res = await fetch(`${API_URL}/admin/equipment`);
    const data = await res.json();
    setEquipment(data.equipment);
  };

  const addEquipment = async () => {
    const res = await fetch(`${API_URL}/admin/equipment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEquip)
    });
    const data = await res.json();
    if (data.success) {
      alert('Equipment added!');
      fetchEquipment();
      setNewEquip({ name: '', status: 'working', notes: '' });
    }
  };

  React.useEffect(() => {
    fetchEquipment();
  }, []);

  return (
    <div className="section">
      <h2>🛠️ Equipment Management</h2>
      <div className="form-group">
        <input placeholder="Equipment Name" value={newEquip.name} onChange={(e) => setNewEquip({ ...newEquip, name: e.target.value })} />
        <select value={newEquip.status} onChange={(e) => setNewEquip({ ...newEquip, status: e.target.value })}>
          <option value="working">Working</option>
          <option value="maintenance">Maintenance</option>
          <option value="broken">Broken</option>
        </select>
        <input placeholder="Notes" value={newEquip.notes} onChange={(e) => setNewEquip({ ...newEquip, notes: e.target.value })} />
        <button onClick={addEquipment} className="btn-primary">Add Equipment</button>
      </div>

      <h3>Equipment List</h3>
      {equipment.map((e, i) => (
        <div key={i} className="equipment-card">
          <p><strong>{e.name}</strong> - Status: {e.status}</p>
          <p>Notes: {e.notes}</p>
        </div>
      ))}
    </div>
  );
}

// ============ TRAINER DASHBOARD ============
function TrainerDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('clients');

  return (
    <div className="dashboard">
      <nav className="tabs">
        <button onClick={() => setActiveTab('clients')} className={activeTab === 'clients' ? 'active' : ''}>Clients</button>
        <button onClick={() => setActiveTab('assign')} className={activeTab === 'assign' ? 'active' : ''}>Assign Plan</button>
        <button onClick={() => setActiveTab('bookings')} className={activeTab === 'bookings' ? 'active' : ''}>Bookings</button>
      </nav>

      <div className="tab-content">
        {activeTab === 'clients' && <ClientsList trainerId={user._id} />}
        {activeTab === 'assign' && <AssignDietPlan trainerId={user._id} />}
        {activeTab === 'bookings' && <TrainerBookings trainerId={user._id} />}
      </div>
    </div>
  );
}

function ClientsList({ trainerId }) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [progress, setProgress] = useState(null);

  const fetchClients = async () => {
    const res = await fetch(`${API_URL}/trainer/clients/${trainerId}`);
    const data = await res.json();
    setClients(data.clients);
  };

  const viewProgress = async (userId) => {
    const res = await fetch(`${API_URL}/clientprogress/${userId}`);
    const data = await res.json();
    setProgress(data);
    setSelectedClient(data.user);
  };

  React.useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="section">
      <h2>👤 My Clients</h2>
      {clients.map((c, i) => (
        <div key={i} className="client-card">
          <p><strong>{c.name}</strong> ({c.email})</p>
          <button onClick={() => viewProgress(c._id)} className="btn-secondary">View Progress</button>
        </div>
      ))}

      {progress && (
        <div className="progress-section">
          <h3>Progress for {selectedClient.name}</h3>
          <h4>Workouts ({progress.workouts.length})</h4>
          {progress.workouts.slice(0, 3).map((w, i) => (
            <div key={i} className="workout-card">
              <p>{new Date(w.date).toLocaleDateString()} - {w.exercises.length} exercises</p>
            </div>
          ))}
          <h4>Body Metrics</h4>
          {progress.bodyMetrics.slice(0, 3).map((b, i) => (
            <div key={i} className="metrics-card">
              <p>{new Date(b.date).toLocaleDateString()} - Weight: {b.weight}kg, Body Fat: {b.bodyFat}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AssignDietPlan({ trainerId }) {
  const [clientId, setClientId] = useState('');
  const [planName, setPlanName] = useState('');
  const [planText, setPlanText] = useState('');

  const assignPlan = async () => {
    const res = await fetch(`${API_URL}/dietplan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trainerId, userId: clientId, planName, planText })
    });
    const data = await res.json();
    if (data.success) {
      alert('Diet plan assigned successfully!');
      setClientId('');
      setPlanName('');
      setPlanText('');
    }
  };

  return (
    <div className="section">
      <h2>🥗 Assign Diet Plan</h2>
      <input placeholder="Client ID" value={clientId} onChange={(e) => setClientId(e.target.value)} />
      <input placeholder="Plan Name" value={planName} onChange={(e) => setPlanName(e.target.value)} />
      <textarea placeholder="Plan Details" value={planText} onChange={(e) => setPlanText(e.target.value)} rows="5" />
      <button onClick={assignPlan} className="btn-primary">Assign Plan</button>
    </div>
  );
}

function TrainerBookings({ trainerId }) {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const res = await fetch(`${API_URL}/trainer/bookings/${trainerId}`);
    const data = await res.json();
    setBookings(data.bookings);
  };

  React.useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="section">
      <h2>📅 My Bookings</h2>
      {bookings.map((b, i) => (
        <div key={i} className="booking-card">
          <p><strong>{b.userId?.name}</strong> - {b.classType}</p>
          <p>{new Date(b.date).toLocaleDateString()} at {b.time}</p>
          <p>Status: {b.status}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
