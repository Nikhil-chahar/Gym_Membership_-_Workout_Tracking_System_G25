import React, { useState, useEffect, useCallback } from 'react';
import { memberAPI } from '../../services/api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Progress = ({ user }) => {
  const [workouts, setWorkouts] = useState([]);
  const [metrics, setMetrics] = useState([]);

  const fetchProgress = useCallback(async () => {
    const data = await memberAPI.getProgress(user._id);
    setWorkouts(data.workouts || []);
    setMetrics(data.bodyMetrics || []);
  }, [user._id]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Prepare chart data
  const workoutTrend = workouts.slice(-7).map((w, i) => ({
    day: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    calories: w.caloriesBurned || 0,
    duration: w.totalDuration || 0,
    exercises: w.exercises?.length || 0
  }));

  const exerciseBreakdown = workouts.slice(-10).reduce((acc, w) => {
    w.exercises?.forEach(ex => {
      const existing = acc.find(item => item.name === ex.name);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ name: ex.name, count: 1 });
      }
    });
    return acc;
  }, []);

  const weightProgress = metrics.slice(-5).map(m => ({
    date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: m.weight,
    bodyFat: m.bodyFat,
    muscleMass: m.muscleMass
  }));

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

  return (
    <div className="section">
      <h2>📊 Progress Tracking</h2>
      
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <h3>{workouts.length}</h3>
          <p>Total Workouts</p>
        </div>
        <div className="stat-card">
          <h3>{workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0)}</h3>
          <p>Calories Burned</p>
        </div>
        <div className="stat-card">
          <h3>{workouts.reduce((sum, w) => sum + (w.totalDuration || 0), 0)}</h3>
          <p>Minutes Trained</p>
        </div>
        <div className="stat-card">
          <h3>{Math.ceil(workouts.length / 4)}</h3>
          <p>Weeks Active</p>
        </div>
      </div>

      {workoutTrend.length > 0 && (
        <>
          <h3>🔥 Calories Burned (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={workoutTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(255, 255, 255, 0.98)', 
                  border: '2px solid #667eea',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="calories" 
                stroke="#667eea" 
                strokeWidth={3}
                dot={{ fill: '#667eea', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <h3 style={{ marginTop: '40px' }}>⏱️ Workout Duration & Intensity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workoutTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(255, 255, 255, 0.98)', 
                  border: '2px solid #764ba2',
                  borderRadius: '12px'
                }} 
              />
              <Legend />
              <Bar dataKey="duration" fill="#667eea" radius={[8, 8, 0, 0]} />
              <Bar dataKey="exercises" fill="#764ba2" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      {exerciseBreakdown.length > 0 && (
        <>
          <h3 style={{ marginTop: '40px' }}>💪 Exercise Distribution</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={exerciseBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="count"
              >
                {exerciseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(255, 255, 255, 0.98)', 
                  borderRadius: '12px',
                  border: '2px solid #667eea'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </>
      )}

      {weightProgress.length > 0 && (
        <>
          <h3 style={{ marginTop: '40px' }}>⚖️ Body Metrics Tracking</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(255, 255, 255, 0.98)', 
                  borderRadius: '12px',
                  border: '2px solid #48bb78'
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

      <h3 style={{ marginTop: '40px' }}>📝 Recent Workouts</h3>
      {workouts.slice(0, 5).map((w, i) => (
        <div key={i} className="workout-card">
          <p><strong>📅 {new Date(w.date).toLocaleDateString()}</strong></p>
          <p>
            💪 Exercises: {w.exercises?.length || 0} | 
            ⏱️ Duration: {w.totalDuration || 0}min | 
            🔥 Calories: {w.caloriesBurned || 0}
          </p>
        </div>
      ))}

      {workouts.length === 0 && (
        <div className="chart-placeholder">
          <p style={{ fontSize: '18px', color: '#64748b' }}>
            📈 Start logging workouts to see your progress charts!
          </p>
        </div>
      )}
    </div>
  );
};

export default Progress;
