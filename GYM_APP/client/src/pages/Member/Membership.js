import React, { useState, useEffect, useCallback } from 'react';
import { memberAPI } from '../../services/api';

const Membership = ({ user }) => {
  const [membership, setMembership] = useState(null);
  const [planType, setPlanType] = useState('Monthly');

  const fetchMembership = useCallback(async () => {
    const data = await memberAPI.getMembership(user._id);
    setMembership(data.membership);
  }, [user._id]);

  const buyPlan = async () => {
    const data = await memberAPI.buyMembership({ userId: user._id, planType });
    if (data.success) {
      alert('Membership purchased successfully!');
      fetchMembership();
    }
  };

  useEffect(() => {
    fetchMembership();
  }, [fetchMembership]);

  const plans = [
    { type: 'Monthly', price: 1200, features: ['30 Days Access', 'All Equipment', 'Group Classes', 'Locker Facility'], icon: '📅', color: '#667eea' },
    { type: 'Yearly', price: 12000, features: ['365 Days Access', 'All Equipment', 'Group Classes', 'Locker Facility', 'Personal Trainer', '2 Free Sessions', 'Diet Plan'], icon: '🎯', color: '#48bb78', badge: 'SAVE 17%' }
  ];

  return (
    <div className="section">
      <h2>💳 Membership Plans</h2>
      
      {membership ? (
        <div style={{ marginBottom: '32px' }}>
          <div className="membership-info" style={{ 
            background: membership.status === 'Active' 
              ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' 
              : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            borderLeft: `4px solid ${membership.status === 'Active' ? '#10b981' : '#ef4444'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: membership.status === 'Active' ? '#065f46' : '#991b1b', margin: 0 }}>
                {membership.planType} Plan
              </h3>
              <span className={`badge ${membership.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                {membership.status}
              </span>
            </div>
            <p style={{ fontSize: '16px', color: membership.status === 'Active' ? '#065f46' : '#991b1b' }}>
              <strong>Valid Until:</strong> {new Date(membership.endDate).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: membership.status === 'Active' ? '#065f46' : '#991b1b', marginTop: '8px' }}>
              ₹{membership.price?.toLocaleString()}
            </p>
          </div>
        </div>
      ) : (
        <>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '32px', fontSize: '16px' }}>
            Choose the perfect plan for your fitness journey
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            {plans.map((plan) => (
              <div
                key={plan.type}
                onClick={() => setPlanType(plan.type)}
                style={{
                  background: planType === plan.type 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  padding: '32px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  border: planType === plan.type ? '3px solid #667eea' : '2px solid #e2e8f0',
                  boxShadow: planType === plan.type 
                    ? '0 12px 32px rgba(102, 126, 234, 0.3)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease',
                  transform: planType === plan.type ? 'translateY(-4px)' : 'translateY(0)',
                  position: 'relative'
                }}
              >
                {plan.badge && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: '#f59e0b',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {plan.badge}
                  </div>
                )}
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{plan.icon}</div>
                <h3 style={{ 
                  color: planType === plan.type ? 'white' : '#1e293b',
                  fontSize: '24px',
                  marginBottom: '8px'
                }}>
                  {plan.type}
                </h3>
                <p style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold',
                  color: planType === plan.type ? 'white' : plan.color,
                  marginBottom: '24px'
                }}>
                  ₹{plan.price.toLocaleString()}
                  <span style={{ fontSize: '14px', fontWeight: 'normal', opacity: 0.8 }}>/{plan.type === 'Monthly' ? 'month' : 'year'}</span>
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} style={{ 
                      color: planType === plan.type ? 'white' : '#64748b',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ color: planType === plan.type ? 'white' : '#10b981' }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <button 
            onClick={buyPlan} 
            className="btn-primary"
            style={{ 
              width: '100%',
              padding: '16px',
              fontSize: '18px',
              marginTop: '16px'
            }}
          >
            Purchase {planType} Plan - ₹{plans.find(p => p.type === planType)?.price.toLocaleString()}
          </button>
        </>
      )}
    </div>
  );
};

export default Membership;
