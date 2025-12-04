import React, { useState } from 'react';
import TabNavigation from '../../components/TabNavigation';
import AdminDashboardView from './AdminDashboardView';
import MembersManagement from './MembersManagement';
import TrainersManagement from './TrainersManagement';
import EquipmentManagement from './EquipmentManagement';

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'members', label: 'Members' },
    { id: 'trainers', label: 'Trainers' },
    { id: 'equipment', label: 'Equipment' },
  ];

  return (
    <div className="dashboard">
      <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="tab-content">
        {activeTab === 'dashboard' && <AdminDashboardView />}
        {activeTab === 'members' && <MembersManagement />}
        {activeTab === 'trainers' && <TrainersManagement />}
        {activeTab === 'equipment' && <EquipmentManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
