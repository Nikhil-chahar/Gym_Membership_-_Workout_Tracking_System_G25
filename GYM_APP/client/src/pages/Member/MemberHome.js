import React, { useState, useEffect } from 'react';
import { memberAPI } from '../../services/api';

const MemberHome = ({ user }) => {
  const [stats, setStats] = useState({ workouts: 0, attendance: 0, bookings: 0, streak: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const progressData = await memberAPI.getProgress(user._id);
        const attendanceData = await memberAPI.getAttendance(user._id);
        const bookingsData = await memberAPI.getBookings(user._id);
        
        setStats({
          workouts: progressData.workouts?.length || 0,
          attendance: attendanceData.attendance?.length || 0,
          bookings: bookingsData.bookings?.length || 0,
          streak: Math.min(attendanceData.attendance?.length || 0, 30)
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, [user._id]);

  const motivationalQuotes = [
    "Your only limit is you!",
    "Believe in yourself and all that you are!",
    "Push yourself, because no one else is going to do it for you!",
    "Great things never come from comfort zones!",
    "Success starts with self-discipline!"
  ];

  const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="section">
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '32px',
        borderRadius: '16px',
        marginBottom: '32px',
        color: 'white',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
      }}>
        <h2 style={{ color: 'white', fontSize: '32px', marginBottom: '8px' }}>Welcome, {user.name}! 💪</h2>
        <p style={{ fontSize: '16px', opacity: 0.95, fontStyle: 'italic' }}>✨ {quote}</p>
      </div>
      
      <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '24px', textAlign: 'center' }}>
        Track your fitness journey with GymFit Pro
      </p>
      
      <div className="stats-grid">
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <h3>{stats.workouts}</h3>
          <p>🏋️ Workouts Logged</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' }}>
          <h3>{stats.attendance}</h3>
          <p>📅 Daily Check-ins</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
          <h3>{stats.bookings}</h3>
          <p>📊 Classes Booked</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
          <h3>{stats.streak}</h3>
          <p>🔥 Day Streak</p>
        </div>
      </div>

      <div style={{
        marginTop: '32px',
        padding: '24px',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        borderRadius: '12px',
        borderLeft: '4px solid #f59e0b'
      }}>
        <h3 style={{ color: '#92400e', marginBottom: '8px' }}>💡 Quick Tips</h3>
        <ul style={{ color: '#78350f', lineHeight: '1.8' }}>
          <li>✓ Stay consistent with your workouts</li>
          <li>✓ Track your progress regularly</li>
          <li>✓ Don't forget to log your body metrics</li>
          <li>✓ Book your favorite classes in advance</li>
        </ul>
      </div>
    </div>
  );
};

export default MemberHome;
