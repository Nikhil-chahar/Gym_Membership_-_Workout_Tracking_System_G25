import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboardView = () => {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    const data = await adminAPI.getDashboard();
    setStats(data);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) return <div className="loading">Loading dashboard...</div>;

  // Sample data for charts
  const monthlyRevenue = [
    { month: 'Jan', revenue: 45000, members: 32 },
    { month: 'Feb', revenue: 52000, members: 38 },
    { month: 'Mar', revenue: 48000, members: 35 },
    { month: 'Apr', revenue: 61000, members: 42 },
    { month: 'May', revenue: 55000, members: 40 },
    { month: 'Jun', revenue: 67000, members: 48 }
  ];

  const membershipTypes = [
    { name: 'Monthly', value: stats.totalMembers * 0.6, color: '#667eea' },
    { name: 'Yearly', value: stats.totalMembers * 0.4, color: '#764ba2' }
  ];

  const attendanceData = [
    { day: 'Mon', checkIns: 45 },
    { day: 'Tue', checkIns: 52 },
    { day: 'Wed', checkIns: 48 },
    { day: 'Thu', checkIns: 61 },
    { day: 'Fri', checkIns: 55 },
    { day: 'Sat', checkIns: 72 },
    { day: 'Sun', checkIns: 38 }
  ];

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
          <h3>₹{stats.revenue?.toLocaleString()}</h3>
          <p>Total Revenue</p>
        </div>
        <div className="stat-card">
          <h3>{stats.expiringMembers?.length || 0}</h3>
          <p>Expiring Soon</p>
        </div>
      </div>

      <h3 style={{ marginTop: '40px' }}>💰 Revenue & Growth Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyRevenue}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis yAxisId="left" stroke="#64748b" />
          <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
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
            yAxisId="left"
            type="monotone" 
            dataKey="revenue" 
            stroke="#48bb78" 
            strokeWidth={3}
            dot={{ fill: '#48bb78', r: 6 }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="members" 
            stroke="#667eea" 
            strokeWidth={3}
            dot={{ fill: '#667eea', r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '40px' }}>
        <div>
          <h3>👥 Membership Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={membershipTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${Math.round(value)}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {membershipTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
        </div>

        <div>
          <h3>📍 Daily Check-ins</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
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
              <Bar dataKey="checkIns" fill="#764ba2" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3 style={{ marginTop: '40px' }}>⚠️ Expiring Memberships (Next 7 Days)</h3>
      {stats.expiringMembers && stats.expiringMembers.length > 0 ? (
        stats.expiringMembers.map((m, i) => (
          <div key={i} className="member-card">
            <p><strong>{m.userId?.name || 'Unknown'}</strong> ({m.userId?.email || 'N/A'})</p>
            <p>Expires: {new Date(m.endDate).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <div className="chart-placeholder" style={{ padding: '24px' }}>
          <p>✅ No memberships expiring in the next 7 days</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardView;
