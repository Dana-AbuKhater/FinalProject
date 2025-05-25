import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Calendar from "../InteractiveCalendar/Calendar";

//import './SalonDashboard.css';

const SalonDashboard = () => {

  const [setSelectedDate] = useState(null);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
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

  // دالة لجلب عدد الحجوزات (تم نقلها لتكون دالة مستقلة وليست داخل الـ catch)
  const fetchAppointmentsCount = async (salonId) => {
    console.log("  salonId  =", salonId);
    try {
      const { data } = await axios.get(`http://localhost:3000/appointments/count/${salonId}`);
      setAppointmentsCount(data.total_appointments);
    } catch (err) {
      console.error('Error fetching appointments count:', err);
      // التعامل مع خطأ الـ 401 بشكل خاص
      if (err.response && err.response.status === 401) {
        setError('يرجى تسجيل الدخول مرة أخرى. الجلسة انتهت.');
        localStorage.removeItem('token'); // إزالة التوكن القديم
        navigate('/login'); // توجيه لصفحة تسجيل الدخول
      } else {
        setError(err.response?.data?.message || 'فشل في تحميل عدد الحجوزات.'); // غيرتها لـ 'فشل في تحميل عدد الحجوزات.'
      }
    }
  }; // 🌟 هذا هو القوس الذي يغلق دالة `WorkspaceAppointmentsCount`


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
          setError('يرجى تسجيل الدخول مرة أخرى. الجلسة انتهت.');
          localStorage.removeItem('token'); // إزالة التوكن القديم
          navigate('/login'); // توجيه لصفحة تسجيل الدخول
        } else {
          setError(err.response?.data?.message || 'فشل في تحميل معلومات الصالون.');
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
        {/* كارد عدد الحجوزات */}
        <div className="info-section">
          <h2>إحصائيات</h2>
          <div className="info-card" style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px' }}>
            <h3>عدد الحجوزات</h3>
            <p style={{ fontSize: '30px', fontWeight: 'bold', marginTop: '10px' }}>{appointmentsCount}</p>
          </div>
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