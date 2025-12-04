import React, { useState, useEffect, useCallback } from 'react';
import { trainerAPI } from '../../services/api';

const TrainerBookings = ({ trainerId }) => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = useCallback(async () => {
    const data = await trainerAPI.getBookings(trainerId);
    setBookings(data.bookings || []);
  }, [trainerId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

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
};

export default TrainerBookings;
