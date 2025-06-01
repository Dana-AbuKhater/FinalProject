import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Calendar from "../InteractiveCalendar/Calendar";
import './SalonDashboard.css'; // تأكد من وجود ملف CSS المناسب


const SalonDashboard = () => {

  const [selectedDate, setSelectedDate] = useState(null);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [salonInfo, setSalonInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
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
  const fetchAppointmentsCount = async (salonId) => {
    console.log("  salonId  =", salonId);
    try {
      const { data } = await axios.get(`http://localhost:3000/appointments/count/${salonId}`);
      setAppointmentsCount(data.total_appointments);
    } catch (err) {
      console.error('Error fetching appointments count:', err);
      // التعامل مع خطأ الـ 401 بشكل خاص
      if (err.response && err.response.status === 401) {
        setError('Please login again. Session expired.');
        localStorage.removeItem('token'); // إزالة التوكن القديم
        navigate('/login'); // توجيه لصفحة تسجيل الدخول
      } else {
        setError(err.response?.data?.message || 'Failed to load appointments count.'); // غيرتها لـ 'فشل في تحميل عدد الحجوزات.'
      }
    }
  }; // 🌟 هذا هو القوس الذي يغلق دالة `WorkspaceAppointmentsCount`
  console.log("Salon Info:", salonInfo); // لتتبع بيانات الصالون

  // دالة لجلب عدد الحجوزات (تم نقلها لتكون دالة مستقلة وليست داخل الـ catch)


  useEffect(() => {
    const fetchSalonInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        setLoading(true);
        const { data } = await axios.get('http://localhost:3000/api/salon/info', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Salon Info Data:", data); // Add this to see the structure of data


        /* const endpoint = `http://localhost:3000/api/salon/info`;

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
           })*/

        /*const { data } = await axios.get('/api/salon/info', {
       headers: { Authorization: `Bearer ${token}` }
     });*/
        setSalonInfo(data);
        if (data._id) {
          console.log("Fetching appointments count for Salon ID:", data._id);
          // قم باستدعاء الدالة fetchAppointmentsCount هنا
          await fetchAppointmentsCount(data._id);
        } else {
          console.warn("Salon _id not found in fetched salon info. Cannot fetch appointments count.");
          setAppointmentsCount(0); // حط 0 إذا ما لقيت الـ ID
        }
        setLoading(false);
        setError(null); // مسح أي أخطاء سابقة

        // بعد ما نجيب بيانات الصالون نجيب عدد الحجوزات
        // fetchAppointmentsCount(data._id); // اتأكد إنه الصالون بيرجع _id هون

      } catch (err) {
        setLoading(false); // انتهى التحميل بخطأ
        console.error('Error fetching salon info or appointments count:', err);

        // التعامل مع خطأ الـ 401 بشكل خاص
        if (err.response && err.response.status === 401) {
          setError('Please login again. Session expired.');
          localStorage.removeItem('token'); // إزالة التوكن القديم
          navigate('/login'); // توجيه لصفحة تسجيل الدخول
        } else {
          setError(err.response?.data?.message || 'Failed to load salon information.');
        }
      } // 🌟 هذا هو القوس الذي يغلق الـ `catch` block الخاص بـ `WorkspaceSalonInfo`
    }; // 🌟 وهذا هو القوس الذي يغلق دالة `WorkspaceSalonInfo`


    fetchSalonInfo();
  }, [navigate]);

  if (loading) return <div className="dashboard-loading">Loading salon information...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="salon-dashboard">
      <div className="dashboard-header">
        <h1>Welcome {salonInfo.name}</h1>
      </div>

      <div className="dashboard-content">
        <div className="info-section">
          <h2>Salon Information</h2>
          <div className="info-card">
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">{salonInfo.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{salonInfo.owner_email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone:</span>
              <span className="info-value">{salonInfo.phone}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Address:</span>
              <span className="info-value">{salonInfo.address}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Working Hours:</span>
              <span className="info-value">{salonInfo.workingHours}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Service Type:</span>
              <span className="info-value">{salonInfo.service_type}</span>
            </div>
            {salonInfo.website && (
              <div className="info-item">
                <span className="info-label">Website:</span>
                <span className="info-value">
                  <a href={salonInfo.website} target="_blank" rel="noopener noreferrer">
                    {salonInfo.website}
                  </a>
                </span>
              </div>
            )}
            {salonInfo.description && (
              <div className="info-item">
                <span className="info-label">Description:</span>
                <span className="info-value">{salonInfo.description}</span>
              </div>
            )}
          </div>
          <button
            className="edit-button"
            onClick={() => navigate('/EditSalonInfo')} // Pass the salonInfo to the edit page
          >
            Edit Information
          </button>
        </div>

        <div className="appointments-section">
          <div className="form-group">
            <label>Show appointments</label>
            <button
              onClick={handleCalendarButtonClick}
              className="show-calendar"
              type="button"
            >
              {showCalendarModal ? "❌" : "📅 Show Booked Days"}
            </button>
            {showCalendarModal && (
              <div className="calendar-modal">
                <div className="calendar-modal-content">
                  <Calendar onDateSelect={handleDateSelect} />
                  <button className="close-calendar-button" onClick={() => setShowCalendarModal(false)}>
                    ❌
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* <button className="view-appointments-button" onClick={() => navigate('/appointments')}>
            View Appointments
          </button> */}
          <h2>Statistics</h2>
          <div className="info-card" style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px' }}>
            <h3>Appointments Count</h3>
            <p style={{ fontSize: '30px', fontWeight: 'bold', marginTop: '10px' }}>{appointmentsCount}</p>
          </div>
          {/* كارد عدد الحجوزات */}

        </div>




        <div className="services-section">
          <div className="add-service-button">
            <button
              onClick={() => navigate("/AddServiceForm")}
              className="add-service-link"
            >
              Add New Service
            </button>
          </div>


          <div className="info-section">
            <button className="manage-services-button" onClick={() => navigate('/manage-services')}>
              Manage Services
            </button>
          </div>



          {/* <div className="service-category">
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
          </div> */}
        </div>

      </div>
    </div>
  );
};

export default SalonDashboard;