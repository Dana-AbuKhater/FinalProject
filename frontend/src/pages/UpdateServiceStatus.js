// UpdateServiceStatus.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const UpdateServiceStatus = ({ serviceId, currentStatus }) => { // استقبال currentStatus
  const [selectedStatus, setSelectedStatus] = useState(currentStatus || 'visible'); // القيمة الافتراضية

  // تحديث الحالة عند تغيير serviceId أو currentStatus
  useEffect(() => {
    setSelectedStatus(currentStatus || 'visible');
  }, [currentStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication token is missing. Please log in.');
        return;
      }
      /*
      await axios.put(`/api/services/${serviceId}`, { status: selectedStatus }, { // إرسال 'status'
        headers: { Authorization: `Bearer ${token}` } // أرسل التوكن إذا كان مطلوباً

      });*/

      const response = await fetch(`http://localhost:3000/api/services/${serviceId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: selectedStatus }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update service status');
      }
      alert('Service status updated successfully!');
    } catch (error) {
      console.error('Error updating service status:', error.response ? error.response.data : error.message);
      alert(error.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={`status-select-${serviceId}`}>Select Status:</label>
      <select
        id={`status-select-${serviceId}`}
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        <option value="visible">Visible</option>
        <option value="hidden">Hidden</option>
        <option value="deleted">Deleted</option>
      </select>
      <button type="submit">Update Status</button>
    </form>
  );
};

export default UpdateServiceStatus;