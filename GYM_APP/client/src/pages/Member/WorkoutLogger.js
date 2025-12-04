import React, { useState } from 'react';
import { memberAPI } from '../../services/api';

const WorkoutLogger = ({ user }) => {
  const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '', weight: '' }]);
  const [totalDuration, setTotalDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');

  const exercisePresets = [
    { name: 'Bench Press', icon: '💪' },
    { name: 'Squats', icon: '🦵' },
    { name: 'Deadlift', icon: '🏋️' },
    { name: 'Pull-ups', icon: '🤸' },
    { name: 'Push-ups', icon: '👊' },
    { name: 'Bicep Curls', icon: '💪' },
    { name: 'Shoulder Press', icon: '🏋️' },
    { name: 'Lunges', icon: '🦵' },
    { name: 'Plank', icon: '🧘' },
    { name: 'Running', icon: '🏃' }
  ];

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', weight: '' }]);
  };

  const removeExercise = (index) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index));
    }
  };

  const updateExercise = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const logWorkout = async () => {
    if (!totalDuration || !caloriesBurned || exercises.some(ex => !ex.name)) {
      alert('Please fill in all required fields!');
      return;
    }

    const data = await memberAPI.logWorkout({
      userId: user._id,
      exercises,
      totalDuration: parseInt(totalDuration),
      caloriesBurned: parseInt(caloriesBurned)
    });
    
    if (data.success) {
      alert('🎉 Workout logged successfully!');
      setExercises([{ name: '', sets: '', reps: '', weight: '' }]);
      setTotalDuration('');
      setCaloriesBurned('');
    }
  };

  const totalVolume = exercises.reduce((sum, ex) => {
    const sets = parseInt(ex.sets) || 0;
    const reps = parseInt(ex.reps) || 0;
    const weight = parseInt(ex.weight) || 0;
    return sum + (sets * reps * weight);
  }, 0);

  return (
    <div className="section">
      <h2>🏋️ Log Workout</h2>
      
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '24px',
        color: 'white'
      }}>
        <h3 style={{ color: 'white', marginBottom: '16px' }}>Quick Stats</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{exercises.length}</p>
            <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>Exercises</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{totalDuration || 0}</p>
            <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>Minutes</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{caloriesBurned || 0}</p>
            <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>Calories</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{totalVolume}</p>
            <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>Total Volume</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ marginBottom: '12px' }}>Quick Add Exercises</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {exercisePresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                const lastIndex = exercises.length - 1;
                if (exercises[lastIndex].name === '') {
                  updateExercise(lastIndex, 'name', preset.name);
                } else {
                  setExercises([...exercises, { name: preset.name, sets: '', reps: '', weight: '' }]);
                }
              }}
              style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                border: '2px solid #cbd5e1',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
                e.target.style.color = '#1e293b';
              }}
            >
              {preset.icon} {preset.name}
            </button>
          ))}
        </div>
      </div>

      {exercises.map((ex, i) => (
        <div 
          key={i} 
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '12px',
            border: '2px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, color: '#1e293b' }}>Exercise {i + 1}</h4>
            {exercises.length > 1 && (
              <button 
                onClick={() => removeExercise(i)}
                style={{
                  background: '#fee2e2',
                  color: '#991b1b',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                🗑️ Remove
              </button>
            )}
          </div>
          <div className="exercise-row">
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>
                Exercise Name
              </label>
              <input 
                placeholder="e.g., Bench Press" 
                value={ex.name} 
                onChange={(e) => updateExercise(i, 'name', e.target.value)} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>
                Sets
              </label>
              <input 
                placeholder="3" 
                type="number" 
                value={ex.sets} 
                onChange={(e) => updateExercise(i, 'sets', e.target.value)} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>
                Reps
              </label>
              <input 
                placeholder="10" 
                type="number" 
                value={ex.reps} 
                onChange={(e) => updateExercise(i, 'reps', e.target.value)} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>
                Weight (kg)
              </label>
              <input 
                placeholder="50" 
                type="number" 
                value={ex.weight} 
                onChange={(e) => updateExercise(i, 'weight', e.target.value)} 
              />
            </div>
          </div>
        </div>
      ))}
      
      <button 
        onClick={addExercise} 
        className="btn-secondary"
        style={{ width: '100%', marginBottom: '24px', padding: '12px' }}
      >
        ➕ Add Another Exercise
      </button>

      <div style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '16px',
        border: '2px solid #f59e0b'
      }}>
        <h3 style={{ color: '#92400e', marginBottom: '16px' }}>Workout Summary</h3>
        <div className="workout-summary">
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#92400e', marginBottom: '4px', fontWeight: '600' }}>
              ⏱️ Total Duration (minutes)
            </label>
            <input 
              placeholder="45" 
              type="number" 
              value={totalDuration} 
              onChange={(e) => setTotalDuration(e.target.value)} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#92400e', marginBottom: '4px', fontWeight: '600' }}>
              🔥 Calories Burned
            </label>
            <input 
              placeholder="350" 
              type="number" 
              value={caloriesBurned} 
              onChange={(e) => setCaloriesBurned(e.target.value)} 
            />
          </div>
        </div>
      </div>
      
      <button 
        onClick={logWorkout} 
        className="btn-primary"
        style={{ width: '100%', padding: '16px', fontSize: '18px' }}
      >
        💾 Save Workout
      </button>
    </div>
  );
};

export default WorkoutLogger;
