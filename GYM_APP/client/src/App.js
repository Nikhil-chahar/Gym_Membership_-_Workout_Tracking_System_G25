import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Auth from './components/Auth';
import MemberDashboard from './pages/Member/MemberDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import TrainerDashboard from './pages/Trainer/TrainerDashboard';
import './App.css';

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="app">
      <Header />
      {!user ? (
        <Auth />
      ) : (
        <div>
          {user.role === 'member' && <MemberDashboard user={user} />}
          {user.role === 'admin' && <AdminDashboard user={user} />}
          {user.role === 'trainer' && <TrainerDashboard user={user} />}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}


export default App;

