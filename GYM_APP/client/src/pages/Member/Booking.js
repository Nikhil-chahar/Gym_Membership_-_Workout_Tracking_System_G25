import React, { useState, useEffect, useCallback } from 'react';
import { memberAPI } from '../../services/api';

const Booking = ({ user }) => {
  const [classType, setClassType] = useState('Zumba');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [bookings, setBookings] = useState([]);

  const fetchBookings = useCallback(async () => {
    const data = await memberAPI.getBookings(user._id);
    setBookings(data.bookings || []);
  }, [user._id]);

  const bookClass = async () => {
    const data = await memberAPI.bookClass({ userId: user._id, classType, date, time });
    if (data.success) {
      alert('Booking successful!');
      fetchBookings();
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const classOptions = [
    { value: 'Zumba', label: 'Zumba Dance', icon: '💃', color: '#f59e0b' },
    { value: 'Yoga', label: 'Yoga & Meditation', icon: '🧘', color: '#8b5cf6' },
    { value: 'PersonalTraining', label: 'Personal Training', icon: '💪', color: '#ef4444' },
    { value: 'Cardio', label: 'Cardio Blast', icon: '🏃', color: '#3b82f6' },
    { value: 'Strength', label: 'Strength Training', icon: '🏋️', color: '#10b981' }
  ];

  return (
    <div className="section">
      <h2>📅 Book Class/Session</h2>
      
      <div style={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '32px',
        borderRadius: '16px',
        marginBottom: '32px',
        border: '2px dashed #cbd5e1'
      }}>
        <h3 style={{ marginBottom: '24px', color: '#1e293b' }}>Select Your Class</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {classOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => setClassType(option.value)}
              style={{
                background: classType === option.value 
                  ? `linear-gradient(135deg, ${option.color} 0%, ${option.color}dd 100%)`
                  : 'white',
                color: classType === option.value ? 'white' : '#1e293b',
                padding: '20px',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                border: classType === option.value ? `2px solid ${option.color}` : '2px solid #e2e8f0',
                transition: 'all 0.3s ease',
                transform: classType === option.value ? 'scale(1.05)' : 'scale(1)',
                boxShadow: classType === option.value ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{option.icon}</div>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>{option.label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#64748b', fontWeight: '600', fontSize: '14px' }}>
              📅 Date
            </label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#64748b', fontWeight: '600', fontSize: '14px' }}>
              ⏰ Time
            </label>
            <input 
              type="time" 
              value={time} 
              onChange={(e) => setTime(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        </div>
        
        <button 
          onClick={bookClass} 
          className="btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: '16px' }}
          disabled={!date || !time}
        >
          🎯 Confirm Booking
        </button>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>My Bookings</h3>
          <span className="badge badge-info">{bookings.length} total</span>
        </div>
        
        {bookings.length > 0 ? (
          bookings.map((b, i) => {
            const bookingClass = classOptions.find(c => c.value === b.classType);
            const isPast = new Date(b.date) < new Date();
            return (
              <div 
                key={i} 
                className="booking-card"
                style={{
                  background: isPast 
                    ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
                    : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  opacity: isPast ? 0.7 : 1,
                  borderLeft: `4px solid ${bookingClass?.color || '#667eea'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontSize: '32px' }}>{bookingClass?.icon || '📅'}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: '600', fontSize: '16px', color: '#1e293b' }}>
                        {bookingClass?.label || b.classType}
                      </p>
                      <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                        📅 {new Date(b.date).toLocaleDateString('en-US', { 
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })} at ⏰ {b.time}
                      </p>
                    </div>
                  </div>
                  <span className={`badge ${b.status === 'Confirmed' ? 'badge-success' : b.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>
                    {b.status}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="chart-placeholder">
            <p>No bookings yet. Book your first class above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
