// ServicesList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ServicesList = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/salon/services', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setServices(response.data);
      } catch (error) {
        alert(error.response.data.error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div>
      <h2>Services</h2>
      <ul>
        {services.map((service) => (
          <li key={service._id}>
            {service.name} - ${service.price} (Discount: {service.discount}%)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServicesList;