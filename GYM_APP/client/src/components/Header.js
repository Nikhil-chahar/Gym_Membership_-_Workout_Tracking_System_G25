import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin': return 'badge-danger';
      case 'trainer': return 'badge-warning';
      case 'member': return 'badge-success';
      default: return 'badge-info';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return '👑';
      case 'trainer': return '💪';
      case 'member': return '🏃';
      default: return '👤';
    }
  };

  return (
    <header className="header">
      <div className="header-brand">
        <div className="brand-icon">🏋️</div>
        <div className="brand-text">
          <h1>GymFit Pro</h1>
          <p className="brand-tagline">Your Fitness Journey</p>
        </div>
      </div>
      {user && (
        <div className="user-info">
          <div className="user-details">
            <span className="user-name">
              {getRoleIcon(user.role)} {user.name}
            </span>
            <span className={`badge ${getRoleBadgeColor(user.role)}`}>
              {user.role}
            </span>
          </div>
          <button onClick={logout} className="btn-logout">
            <span className="btn-icon">🚪</span>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
