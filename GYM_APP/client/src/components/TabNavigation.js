import React from 'react';

const TabNavigation = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <nav className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={activeTab === tab.id ? 'active' : ''}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default TabNavigation;
