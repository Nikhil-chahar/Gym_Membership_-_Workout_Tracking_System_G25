import React, { useState } from 'react';
import { trainerAPI } from '../../services/api';

const AssignDietPlan = ({ trainerId }) => {
  const [clientId, setClientId] = useState('');
  const [planName, setPlanName] = useState('');
  const [planText, setPlanText] = useState('');

  const assignPlan = async () => {
    const data = await trainerAPI.assignDietPlan({ 
      trainerId, 
      userId: clientId, 
      planName, 
      planText 
    });
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
      <input 
        placeholder="Client ID" 
        value={clientId} 
        onChange={(e) => setClientId(e.target.value)} 
      />
      <input 
        placeholder="Plan Name" 
        value={planName} 
        onChange={(e) => setPlanName(e.target.value)} 
      />
      <textarea 
        placeholder="Plan Details" 
        value={planText} 
        onChange={(e) => setPlanText(e.target.value)} 
        rows="5" 
      />
      <button onClick={assignPlan} className="btn-primary">Assign Plan</button>
    </div>
  );
};

export default AssignDietPlan;
