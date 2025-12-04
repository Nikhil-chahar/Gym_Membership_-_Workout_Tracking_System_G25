import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const EquipmentManagement = () => {
  const [equipment, setEquipment] = useState([]);
  const [newEquip, setNewEquip] = useState({ name: '', status: 'working', notes: '' });

  const fetchEquipment = async () => {
    const data = await adminAPI.getEquipment();
    setEquipment(data.equipment);
  };

  const addEquipment = async () => {
    const data = await adminAPI.addEquipment(newEquip);
    if (data.success) {
      alert('Equipment added!');
      fetchEquipment();
      setNewEquip({ name: '', status: 'working', notes: '' });
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  return (
    <div className="section">
      <h2>🛠️ Equipment Management</h2>
      <div className="form-group">
        <input 
          placeholder="Equipment Name" 
          value={newEquip.name} 
          onChange={(e) => setNewEquip({ ...newEquip, name: e.target.value })} 
        />
        <select 
          value={newEquip.status} 
          onChange={(e) => setNewEquip({ ...newEquip, status: e.target.value })}
        >
          <option value="working">Working</option>
          <option value="maintenance">Maintenance</option>
          <option value="broken">Broken</option>
        </select>
        <input 
          placeholder="Notes" 
          value={newEquip.notes} 
          onChange={(e) => setNewEquip({ ...newEquip, notes: e.target.value })} 
        />
        <button onClick={addEquipment} className="btn-primary">Add Equipment</button>
      </div>

      <h3>Equipment List</h3>
      {equipment.map((e, i) => (
        <div key={i} className="equipment-card">
          <p><strong>{e.name}</strong> - Status: {e.status}</p>
          <p>Notes: {e.notes}</p>
        </div>
      ))}
    </div>
  );
};

export default EquipmentManagement;
