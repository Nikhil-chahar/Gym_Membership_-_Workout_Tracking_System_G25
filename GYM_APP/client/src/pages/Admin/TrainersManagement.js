import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const TrainersManagement = () => {
  const [trainers, setTrainers] = useState([]);

  const fetchTrainers = async () => {
    const data = await adminAPI.getTrainers();
    setTrainers(data.trainers);
  };

  useEffect(() => {
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
};

export default TrainersManagement;
