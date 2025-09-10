// UpdateServiceStatus.js
import React, { useState } from 'react';
import axios from 'axios';

const UpdateServiceStatus = ({ serviceId }) => {
  const [isActive, setIsActive] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/salon/services/${serviceId}`, { isActive, isDeleted }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Service status updated successfully!');
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Active:
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
      </label>
      <label>
        Deleted:
        <input type="checkbox" checked={isDeleted} onChange={(e) => setIsDeleted(e.target.checked)} />
      </label>
      <button type="submit">Update Status</button>
    </form>
  );
};

export default UpdateServiceStatus;