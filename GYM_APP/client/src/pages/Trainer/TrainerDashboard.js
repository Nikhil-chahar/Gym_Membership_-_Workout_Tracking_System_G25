import React, { useState } from 'react';
import TabNavigation from '../../components/TabNavigation';
import ClientsList from './ClientsList';
import AssignDietPlan from './AssignDietPlan';
import TrainerBookings from './TrainerBookings';

const TrainerDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('clients');

  const tabs = [
    { id: 'clients', label: 'Clients' },
    { id: 'assign', label: 'Assign Plan' },
    { id: 'bookings', label: 'Bookings' },
  ];

  return (
    <div className="dashboard">
      <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="tab-content">
        {activeTab === 'clients' && <ClientsList trainerId={user._id} />}
        {activeTab === 'assign' && <AssignDietPlan trainerId={user._id} />}
        {activeTab === 'bookings' && <TrainerBookings trainerId={user._id} />}
      </div>
    </div>
  );
};

export default TrainerDashboard;
