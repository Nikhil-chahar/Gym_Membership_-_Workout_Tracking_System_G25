import React, { useState, useEffect, useCallback } from 'react';
import { memberAPI } from '../../services/api';

const CheckIn = ({ user }) => {
  const [message, setMessage] = useState('');
  const [attendance, setAttendance] = useState([]);

  const fetchAttendance = useCallback(async () => {
    const data = await memberAPI.getAttendance(user._id);
    setAttendance(data.attendance || []);
  }, [user._id]);

  const handleCheckIn = async () => {
    const data = await memberAPI.checkIn(user._id);
    if (data.success) {
      setMessage(data.message);
      fetchAttendance();
    } else {
      setMessage(data.error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const today = new Date().toDateString();
  const checkedInToday = attendance.some(a => new Date(a.date).toDateString() === today);

  return (
    <div className="section">
      <h2>📍 QR Check-in</h2>
      
      <div className="qr-box" style={{
        background: checkedInToday 
          ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderColor: checkedInToday ? '#10b981' : '#cbd5e1'
      }}>
        <div className="qr-code" style={{ fontSize: checkedInToday ? '100px' : '120px' }}>
          {checkedInToday ? '✅' : '📱'}
        </div>
        <h3 style={{ color: checkedInToday ? '#065f46' : '#1e293b', marginBottom: '16px' }}>
          {checkedInToday ? 'Already Checked In Today!' : 'Scan to Check In'}
        </h3>
        {!checkedInToday && (
          <button 
            onClick={handleCheckIn} 
            className="btn-primary"
            style={{ padding: '14px 32px', fontSize: '16px' }}
          >
            🚀 Check In Now
          </button>
        )}
        {message && (
          <p className={message.includes('success') ? 'success' : 'message'} style={{ marginTop: '16px' }}>
            {message}
          </p>
        )}
      </div>

      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>📅 Recent Attendance</h3>
          <span className="badge badge-info">{attendance.length} total days</span>
        </div>
        
        {attendance.length > 0 ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            {attendance.slice(0, 10).map((a, i) => {
              const isToday = new Date(a.date).toDateString() === today;
              return (
                <div 
                  key={i} 
                  style={{
                    background: isToday 
                      ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    borderLeft: `4px solid ${isToday ? '#3b82f6' : '#10b981'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{isToday ? '🌟' : '✅'}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>
                        {new Date(a.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                        Check-in: {a.checkInTime}
                      </p>
                    </div>
                  </div>
                  {isToday && <span className="badge badge-info">Today</span>}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="chart-placeholder">
            <p>No attendance records yet. Start checking in!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckIn;
