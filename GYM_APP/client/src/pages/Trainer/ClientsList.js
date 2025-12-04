import React, { useState, useEffect, useCallback } from 'react';
import { trainerAPI } from '../../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ClientsList = ({ trainerId }) => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [progress, setProgress] = useState(null);

  const fetchClients = useCallback(async () => {
    const data = await trainerAPI.getClients(trainerId);
    setClients(data.clients || []);
  }, [trainerId]);

  const viewProgress = async (userId) => {
    const data = await trainerAPI.getClientProgress(userId);
    setProgress(data);
    setSelectedClient(data.user);
  };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Prepare chart data
  const workoutTrend = progress?.workouts?.slice(-7).map(w => ({
    date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    exercises: w.exercises?.length || 0,
    duration: w.totalDuration || 0,
    calories: w.caloriesBurned || 0
  })) || [];

  const metricsData = progress?.bodyMetrics?.slice(-5).map(m => ({
    date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: m.weight,
    bodyFat: m.bodyFat,
    muscleMass: m.muscleMass
  })) || [];

  return (
    <div className="section">
      <h2>👤 My Clients ({clients.length})</h2>
      
      {!selectedClient && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {clients.map((c, i) => (
            <div key={i} className="client-card">
              <p><strong>👤 {c.name}</strong></p>
              <p style={{ fontSize: '14px', color: '#64748b' }}>📧 {c.email}</p>
              <button onClick={() => viewProgress(c._id)} className="btn-secondary" style={{ marginTop: '12px' }}>
                📊 View Progress
              </button>
            </div>
          ))}
        </div>
      )}

      {clients.length === 0 && !selectedClient && (
        <div className="chart-placeholder">
          <p>No clients assigned yet</p>
        </div>
      )}

      {progress && selectedClient && (
        <div className="progress-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3>📈 Progress for {selectedClient.name}</h3>
            <button onClick={() => { setSelectedClient(null); setProgress(null); }} className="btn-secondary">
              ← Back to Clients
            </button>
          </div>

          <div className="stats-grid" style={{ marginBottom: '32px' }}>
            <div className="stat-card">
              <h3>{progress.workouts?.length || 0}</h3>
              <p>Total Workouts</p>
            </div>
            <div className="stat-card">
              <h3>{progress.bodyMetrics?.length || 0}</h3>
              <p>Metrics Logged</p>
            </div>
            <div className="stat-card">
              <h3>{progress.workouts?.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0) || 0}</h3>
              <p>Calories Burned</p>
            </div>
            <div className="stat-card">
              <h3>{progress.workouts?.reduce((sum, w) => sum + (w.totalDuration || 0), 0) || 0}</h3>
              <p>Minutes Trained</p>
            </div>
          </div>

          {workoutTrend.length > 0 && (
            <>
              <h4>💪 Workout Activity</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workoutTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.98)', 
                      border: '2px solid #667eea',
                      borderRadius: '12px'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="exercises" fill="#667eea" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="duration" fill="#764ba2" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}

          {metricsData.length > 0 && (
            <>
              <h4 style={{ marginTop: '40px' }}>⚖️ Body Composition Tracking</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metricsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.98)', 
                      border: '2px solid #48bb78',
                      borderRadius: '12px'
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="weight" stroke="#48bb78" strokeWidth={2} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="bodyFat" stroke="#f59e0b" strokeWidth={2} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="muscleMass" stroke="#3b82f6" strokeWidth={2} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}

          <h4 style={{ marginTop: '40px' }}>📝 Recent Workouts</h4>
          {progress.workouts && progress.workouts.slice(0, 5).map((w, i) => (
            <div key={i} className="workout-card">
              <p><strong>📅 {new Date(w.date).toLocaleDateString()}</strong></p>
              <p>💪 {w.exercises?.length || 0} exercises | ⏱️ {w.totalDuration || 0}min | 🔥 {w.caloriesBurned || 0} cal</p>
            </div>
          ))}

          <h4 style={{ marginTop: '32px' }}>📊 Body Metrics History</h4>
          {progress.bodyMetrics && progress.bodyMetrics.slice(0, 5).map((b, i) => (
            <div key={i} className="metrics-card">
              <p><strong>📅 {new Date(b.date).toLocaleDateString()}</strong></p>
              <p>⚖️ Weight: {b.weight}kg | 📉 Body Fat: {b.bodyFat}% | 💪 Muscle: {b.muscleMass}kg</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientsList;
