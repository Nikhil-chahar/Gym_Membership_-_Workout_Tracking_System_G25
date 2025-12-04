import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const MembersManagement = () => {
  const [members, setMembers] = useState([]);

  const fetchMembers = async () => {
    const data = await adminAPI.getMembers();
    setMembers(data.members);
  };

  const renewMembership = async (membershipId) => {
    const planType = prompt('Enter plan type (Monthly/Yearly):');
    if (!planType) return;
    const data = await adminAPI.renewMembership({ membershipId, planType });
    if (data.success) {
      alert('Membership renewed!');
      fetchMembers();
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="section">
      <h2>👥 Members Management</h2>
      {members.map((m, i) => (
        <div key={i} className="member-card">
          <p><strong>{m.name}</strong> ({m.email})</p>
          {m.membership ? (
            <div>
              <p>Plan: {m.membership.planType} | Status: {m.membership.status}</p>
              <p>Expires: {new Date(m.membership.endDate).toLocaleDateString()}</p>
              <button onClick={() => renewMembership(m.membership._id)} className="btn-secondary">
                Renew
              </button>
            </div>
          ) : (
            <p>No active membership</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default MembersManagement;
