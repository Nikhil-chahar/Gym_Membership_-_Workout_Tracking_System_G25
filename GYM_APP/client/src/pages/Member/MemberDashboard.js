import React, { useState } from 'react';
import TabNavigation from '../../components/TabNavigation';
import MemberHome from './MemberHome';
import Membership from './Membership';
import CheckIn from './CheckIn';
import WorkoutLogger from './WorkoutLogger';
import Progress from './Progress';
import Booking from './Booking';

const MemberDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'membership', label: 'Membership' },
    { id: 'checkin', label: 'Check-in' },
    { id: 'workout', label: 'Log Workout' },
    { id: 'progress', label: 'Progress' },
    { id: 'booking', label: 'Book Class' },
  ];

  return (
    <div className="dashboard">
      <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="tab-content">
        {activeTab === 'home' && <MemberHome user={user} />}
        {activeTab === 'membership' && <Membership user={user} />}
        {activeTab === 'checkin' && <CheckIn user={user} />}
        {activeTab === 'workout' && <WorkoutLogger user={user} />}
        {activeTab === 'progress' && <Progress user={user} />}
        {activeTab === 'booking' && <Booking user={user} />}
      </div>
    </div>
  );
};

export default MemberDashboard;
