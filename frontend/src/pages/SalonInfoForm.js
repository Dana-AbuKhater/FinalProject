import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SalonInfoForm.css';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import Calendar from '../InteractiveCalendar/Calendar';
/*
const Container = styled.div`
  width: 300px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  background: #f8f9fa;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;
const DropBox = styled.div`
  border: 2px dashed #007bff;
  padding: 10px;
  min-height: 50px;
  margin-top: 10px;
  background: white;
`;
const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;
const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
const Button = styled.button`
  padding: 8px;
  border: none;
  background: ${(props) => props.bg || "#007bff"};
  color: white;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 16px;
  &:hover {
    background: ${(props) => props.hover || "#0056b3"};
  }
`;
const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #e9ecef;
  border-radius: 4px;
  margin-top: 5px;
`;
*/
const SalonInfoForm = () => {
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();
  const [salonInfo, setSalonInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    workingHours: '',
    description: '',
    serviceType: 'salon-only',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: ''
    }
  });
  /* 
  <div className="social-media-group">
    <label>Facebook</label>
    <input
      type="text"
      value={salonInfo.socialMedia.facebook}
      onChange={(e) => setSalonInfo({ ...salonInfo, socialMedia: { ...salonInfo.socialMedia, facebook: e.target.value } })}
    />
  </div>
  <div className="social-media-group">
    <label>Instagram</label>
    <input
      type="text"
      value={salonInfo.socialMedia.instagram}
      onChange={(e) => setSalonInfo({ ...salonInfo, socialMedia: { ...salonInfo.socialMedia, instagram: e.target.value } })}
    />
  </div>
  <div className="social-media-group">
    <label>Twitter</label>
    <input
      type="text"
      value={salonInfo.socialMedia.twitter}
      onChange={(e) => setSalonInfo({ ...salonInfo, socialMedia: { ...salonInfo.socialMedia, twitter: e.target.value } })}
    />
  </div>*/
  const [services, setServices] = useState([]);
  useEffect(() => {
    const storedServices = JSON.parse(localStorage.getItem('services')) || [];
    setServices(storedServices);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/salon/info', salonInfo, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Salon info updated successfully!');
    } catch (error) {
      alert(error.response.data.error);
    }
  };
  const handleCalendarButtonClick = (e) => {
    e.preventDefault(); // Prevent form validation
    setShowCalendarModal(!showCalendarModal);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendarModal(false);
  };

  // تصفية الخدمات حسب الحالة
  const visibleServices = services.filter(service => service.status === 'visible');
  const hiddenServices = services.filter(service => service.status === 'hidden');
  const deletedServices = services.filter(service => service.status === 'deleted');

  return (
    <div className="salon-form-container">
      <form onSubmit={handleSubmit} className="salon-form">
        <h1 className="salon-form-title">Hi, {salonInfo.name || 'Salon'}</h1>

        {/* حقول معلومات الصالون */}
        <div className="form-group">
          <label className='lable'>Name</label>
          <input
            type="text"
            value={salonInfo.name}
            onChange={(e) => setSalonInfo({ ...salonInfo, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={salonInfo.email}
            onChange={(e) => setSalonInfo({ ...salonInfo, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            value={salonInfo.phone}
            onChange={(e) => setSalonInfo({ ...salonInfo, phone: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            value={salonInfo.address}
            onChange={(e) => setSalonInfo({ ...salonInfo, address: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Working Hours</label>
          <input
            type="text"
            placeholder="e.g., 9 AM - 6 PM"
            value={salonInfo.workingHours}
            onChange={(e) => setSalonInfo({ ...salonInfo, workingHours: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Service Type</label>
          <select
            value={salonInfo.serviceType}
            onChange={(e) => setSalonInfo({ ...salonInfo, serviceType: e.target.value })}
            required
          >
            <option value="home-only">منزلي فقط</option>
            <option value="salon-only">صالون فقط</option>
            <option value="both">الاثنين معًا</option>
          </select>
        </div>
        <div className="form-group">
          <label>Website</label>
          <input
            type="text"
            value={salonInfo.website}
            onChange={(e) => setSalonInfo({ ...salonInfo, website: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={salonInfo.description}
            onChange={(e) => setSalonInfo({ ...salonInfo, description: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Show appointments</label>
          <button 
            onClick={handleCalendarButtonClick}
            className='show-close-calendar'
            type="button" // Important: prevents form validation
          >
            {showCalendarModal ? '❌' : '📅 Show Booked Days'}
          </button>
        </div>



        <div className="add-service-button">
          <button
            onClick={() => navigate('/AddServiceForm')} // إعادة التوجيه إلى صفحة إضافة الخدمة
            className="add-service-link"
          >
            Add New Service
          </button>
        </div>

        {/* عرض الخدمات */}
        <div className="services-section">
          <div className="service-category">
            <h2>Visible Services</h2>
            {visibleServices.map(service => (
              <div key={service.id} className="service-item">
                <img src={service.image || 'https://via.placeholder.com/50'} alt={service.name} className="service-image" />
                <div className="service-details">
                  <h3>{service.name}</h3>
                  <p>Price: ${service.price}</p>
                  <p>Discount: {service.discount}%</p>
                  <p>Duration: {service.duration} minutes</p>
                  <p>Category: {service.category}</p>
                  <p>Description: {service.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="service-category">
            <h2>Hidden Services</h2>
            {hiddenServices.map(service => (
              <div key={service.id} className="service-item">
                <img src={service.image || 'https://via.placeholder.com/50'} alt={service.name} className="service-image" />
                <div className="service-details">
                  <h3>{service.name}</h3>
                  <p>Price: ${service.price}</p>
                  <p>Discount: {service.discount}%</p>
                  <p>Duration: {service.duration} minutes</p>
                  <p>Category: {service.category}</p>
                  <p>Description: {service.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="service-category">
            <h2>Deleted Services</h2>
            {deletedServices.map(service => (
              <div key={service.id} className="service-item">
                <img src={service.image || 'https://via.placeholder.com/50'} alt={service.name} className="service-image" />
                <div className="service-details">
                  <h3>{service.name}</h3>
                  <p>Price: ${service.price}</p>
                  <p>Discount: {service.discount}%</p>
                  <p>Duration: {service.duration} minutes</p>
                  <p>Category: {service.category}</p>
                  <p>Description: {service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* زر تحديث معلومات الصالون */}
        <button type="submit" className="submit-button">
          Update Salon Info
        </button>
      </form>
      {showCalendarModal && (
        <div className="calendar-modal">
          <div className="calendar-modal-content">
            <Calendar onDateSelect={handleDateSelect} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonInfoForm;