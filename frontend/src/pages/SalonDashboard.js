import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Calendar from "../InteractiveCalendar/Calendar";

//import './SalonDashboard.css';

const SalonDashboard = () => {

  const [setSelectedDate] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [salonInfo, setSalonInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // حالة التحميل

  const handleCalendarButtonClick = (e) => {
    e.preventDefault();
    setShowCalendarModal(!showCalendarModal);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendarModal(false);
  };

  const visibleServices = services.filter(
    (service) => service.status === "visible"
  );
  const hiddenServices = services.filter(
    (service) => service.status === "hidden"
  );
  const deletedServices = services.filter(
    (service) => service.status === "deleted"
  );


  useEffect(() => {
    const fetchSalonInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        setLoading(true);
        const endpoint = `http://localhost:3000/api/salon/info`;

        fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

        })
          .then((res) => {
            console.log("response ", res)
            return res.json()
          })
        /*const { data } = await axios.get('/api/salon/info', {
       headers: { Authorization: `Bearer ${token}` }
     });*/
        // setSalonInfo(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load salon information');
        setLoading(false);
        console.error('Error fetching salon info:', err);
      }
    };

    fetchSalonInfo();
  }, [navigate]);

  if (loading) return <div className="dashboard-loading">Loading salon information...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="salon-dashboard">
      <div className="dashboard-header">
        <h1>مرحباً {salonInfo.name}</h1>
        <button
          className="edit-button"
          onClick={() => navigate('/edit-salon')}
        >
          تعديل المعلومات
        </button>
      </div>

      <div className="dashboard-content">
        <div className="info-section">
          <h2>معلومات الصالون</h2>
          <div className="info-card">
            <div className="info-item">
              <span className="info-label">الاسم:</span>
              <span className="info-value">{salonInfo.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">البريد الإلكتروني:</span>
              <span className="info-value">{salonInfo.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">رقم الهاتف:</span>
              <span className="info-value">{salonInfo.phone}</span>
            </div>
            <div className="info-item">
              <span className="info-label">العنوان:</span>
              <span className="info-value">{salonInfo.address}</span>
            </div>
            <div className="info-item">
              <span className="info-label">ساعات العمل:</span>
              <span className="info-value">{salonInfo.workingHours}</span>
            </div>
            <div className="info-item">
              <span className="info-label">نوع الخدمة:</span>
              <span className="info-value">
                {salonInfo.serviceType === 'home-only' && 'منزلي فقط'}
                {salonInfo.serviceType === 'salon-only' && 'صالون فقط'}
                {salonInfo.serviceType === 'both' && 'منزلي وصالون'}
              </span>
            </div>
            {salonInfo.website && (
              <div className="info-item">
                <span className="info-label">الموقع الإلكتروني:</span>
                <span className="info-value">
                  <a href={salonInfo.website} target="_blank" rel="noopener noreferrer">
                    {salonInfo.website}
                  </a>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="action-section">
          <button className="action-button" onClick={() => navigate('/salon-services')}>
            إدارة الخدمات
          </button>
          <button className="action-button" onClick={() => navigate('/appointments')}>
            عرض المواعيد
          </button>
        </div>

        {salonInfo.description && (
          <div className="description-section">
            <h2>وصف الصالون</h2>
            <p className="salon-description">{salonInfo.description}</p>
          </div>



        )}
        <div className="form-group">
          <label>Show appointments</label>
          <button
            onClick={handleCalendarButtonClick}
            className="show-close-calendar"
            type="button"
          >
            {showCalendarModal ? "❌" : "📅 Show Booked Days"}
          </button>
        </div>
        <div className="add-service-button">
          <button
            onClick={() => navigate("/AddServiceForm")}
            className="add-service-link"
          >
            Add New Service
          </button>
        </div>



        <div className="services-section">
          <div className="service-category">
            <h2>Visible Services</h2>
            {visibleServices.map((service) => (
              <div key={service.id} className="service-item">
                <img
                  src={service.image || "https://via.placeholder.com/50"}
                  alt={service.name}
                  className="service-image"
                />
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
            {hiddenServices.map((service) => (
              <div key={service.id} className="service-item">
                <img
                  src={service.image || "https://via.placeholder.com/50"}
                  alt={service.name}
                  className="service-image"
                />
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
            {deletedServices.map((service) => (
              <div key={service.id} className="service-item">
                <img
                  src={service.image || "https://via.placeholder.com/50"}
                  alt={service.name}
                  className="service-image"
                />
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
            {showCalendarModal && (
              <div className="calendar-modal">
                <div className="calendar-modal-content">
                  <Calendar onDateSelect={handleDateSelect} />
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SalonDashboard;