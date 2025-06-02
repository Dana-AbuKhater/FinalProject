import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Calendar from "../InteractiveCalendar/Calendar";
import './SalonDashboard.css'; // تأكد من وجود ملف CSS المناسب
// import { se } from 'date-fns/locale';
import AppointmentsModal from '../AppointmentsModel/Appointments';

const SalonDashboard = () => {

  const [isEditing, setIsEditing] = useState(false);
  const [salonData, setSalonData] = useState({
    name: '',
    owner_email: '',
    phone: '',
    address: '',
    workingHours: '',
    service_type: '',
    website: '',
    description: ''
  });
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [setSelectedDate] = useState(null);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [salonInfo, setSalonInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [services] = useState([]);
  const navigate = useNavigate();
  const handleEditInfo = () => { setIsEditing(true); };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingField(null);
  };
  const handleUpdateInfo = async () => {
    try {
      const salon_id = salonInfo.salon_id; // تأكد من وجود _id في بيانات الصالون
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3000/api/salon/update-salon/${salon_id}`, salonData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log("Update response Data123:", response.data);
      // salonInfo = response.data; // تأكد من أن هذا هو الشكل الصحيح للبيانات التي تعيدها السيرفر
      setIsEditing(false);
      setEditingField(null);
      setSalonInfo(response.data.data); // Update displayed info with server response
      setSalonData({
        name: response.data.data.name || '',
        owner_email: response.data.data.owner_email || '',
        phone: response.data.data.phone || '',
        address: response.data.data.address || '',
        workingHours: response.data.data.workingHours || '',
        service_type: response.data.data.service_type || '',
        website: response.data.data.website || '',
        description: response.data.data.description || ''
      }); // Update local state with the new salon data
      alert('Salon information updated successfully!');
    } catch (error) {
      console.error('Error updating salon info:', error);
      alert('Failed to update salon information');
    }
  };
  // هنا يمكنك إضافة الكود لتحديث المعلومات في قاعدة البيانات
  console.log("Updated salon data:", salonData);
  const startEditingField = (field) => {
    setEditingField(field);
    setEditingValue(salonData[field] || '');
  };
  const saveFieldEdit = (field) => {
    setSalonData((prev) => ({
      ...prev,
      [field]: editingValue
    }));
    setEditingField(null);
  };
  const handleInputChange = (e) => {
    setEditingValue(e.target.value);
  };

  // const [isLoading, setIsLoading] = useState(true); // حالة التحميل
  const handleCalendarButtonClick = (e) => {
    e.preventDefault();
    setShowCalendarModal(!showCalendarModal);
  };
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendarModal(false);
  };

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
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
  const [/*appointments*/, setAppointments] = useState([]);
  const [/*loadingAppointments*/, setLoadingAppointments] = useState(false);
  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Appointments Data:", response.data); // لتتبع بيانات الحجوزات
      setAppointments(response.data);
      setLoadingAppointments(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setLoadingAppointments(false);
      alert('Failed to load appointments. Please try again later.');
    }
  };
  useEffect(() => {
    if (salonInfo) {
      setSalonData({
        name: salonInfo.name || '',
        owner_email: salonInfo.owner_email || '',
        phone: salonInfo.phone || '',
        address: salonInfo.address || '',
        workingHours: salonInfo.workingHours || '',
        service_type: salonInfo.service_type || '',
        website: salonInfo.website || '',
        description: salonInfo.description || ''
      });
    }
  }, [salonInfo]); // 🌟 هذا هو القوس الذي يغلق الـ useEffect الخاص بتحديث بيانات الصالوqن
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
        <h1>Welcome {salonData.name}</h1>
      </div>
      <div className="dashboard-content">
        <div className="info-section">
          <h2>Salon Information</h2>
          <div className="info-card">
            <div className="info-item">
              <span className="info-label">Name:</span>
              {editingField === 'name' ? (
                <>
                  <input
                    type="text"
                    value={editingValue}
                    onChange={handleInputChange}
                    className="info-edit"
                  />
                  <button onClick={() => saveFieldEdit('name')} className='save-field-button'>✔️</button>
                </>
              ) : (
                <>
                  <span className="info-value">{salonData.name}</span>
                  {isEditing && (
                    <button onClick={() => startEditingField('name')} className='edit-field-button'>✏️</button>
                  )}
                </>
              )}
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              {editingField === 'owner_email' ? (
                <>
                  <input
                    type="email"
                    value={editingValue}
                    onChange={handleInputChange}
                    className="info-edit"
                  />
                  <button onClick={() => saveFieldEdit('owner_email')} className='save-field-button'>✔️</button>
                </>
              ) : (
                <>
                  <span className="info-value">{salonData.owner_email}</span>
                  {isEditing && (
                    <button onClick={() => startEditingField('owner_email')} className='edit-field-button'>✏️</button>
                  )}
                </>
              )}
            </div>
            <div className="info-item">
              <span className="info-label">Phone:</span>
              {editingField === 'phone' ? (
                <>
                  <input
                    type="text"
                    value={editingValue}
                    onChange={handleInputChange}
                    className="info-edit"
                  />
                  <button onClick={() => saveFieldEdit('phone')} className='save-field-button'>✔️</button>
                </>
              ) : (
                <>
                  <span className="info-value">{salonData.phone}</span>
                  {isEditing && (
                    <button onClick={() => startEditingField('phone')} className='edit-field-button'>✏️</button>
                  )}
                </>
              )}
            </div>
            <div className="info-item">
              <span className="info-label">Address:</span>
              {editingField === 'address' ? (
                <>
                  <input
                    type="text"
                    value={editingValue}
                    onChange={handleInputChange}
                    className="info-edit"
                  />
                  <button onClick={() => saveFieldEdit('address')} className='save-field-button'>✔️</button>
                </>
              ) : (
                <>
                  <span className="info-value">{salonData.address}</span>
                  {isEditing && (
                    <button onClick={() => startEditingField('address')} className='edit-field-button'>✏️</button>
                  )}
                </>
              )}
            </div>
            <div className="info-item">
              <span className="info-label">Working Hours:</span>
              {editingField === 'workingHours' ? (
                <>
                  <input
                    type="text"
                    value={editingValue}
                    onChange={handleInputChange}
                    className="info-edit"
                  />
                  <button onClick={() => saveFieldEdit('workingHours')} className='save-field-button'>✔️</button>
                </>
              ) : (
                <>
                  <span className="info-value">{salonData.workingHours}</span>
                  {isEditing && (
                    <button onClick={() => startEditingField('workingHours')} className='edit-field-button'>✏️</button>
                  )}
                </>
              )}
            </div>
            <div className="info-item">
              <span className="info-label">Service Type:</span>
              {editingField === 'service_type' ? (
                <>
                  <input
                    type="text"
                    value={editingValue}
                    onChange={handleInputChange}
                    className="info-edit"
                  />
                  <button onClick={() => saveFieldEdit('service_type')} className='save-field-button'>✔️</button>
                </>
              ) : (
                <>
                  <span className="info-value">{salonData.service_type}</span>
                  {isEditing && (
                    <button onClick={() => startEditingField('service_type')} className='edit-field-button'>✏️</button>
                  )}
                </>
              )}
            </div>
            {salonData.website && (
              <div className="info-item">
                <span className="info-label">Website:</span>
                {editingField === 'website' ? (
                  <>
                    <input
                      type="text"
                      value={editingValue}
                      onChange={handleInputChange}
                      className="info-edit"
                    />
                    <button onClick={() => saveFieldEdit('website')} className='save-field-button'>✔️</button>
                  </>
                ) : (
                  <>
                    <span className="info-value">
                      <a href={salonData.website} target="_blank" rel="noopener noreferrer">
                        {salonData.website}
                      </a>
                    </span>
                    {isEditing && (
                      <button onClick={() => startEditingField('website')} className='edit-field-button'>✏️</button>
                    )}
                  </>
                )}
              </div>
            )}
            {salonData.description && (
              <div className="info-item">
                <span className="info-label">Description:</span>
                {editingField === 'description' ? (
                  <>
                    <textarea
                      value={editingValue}
                      onChange={handleInputChange}
                      className="info-edit"
                    />
                    <button onClick={() => saveFieldEdit('description')} className='save-field-button'>✔️</button>
                  </>
                ) : (
                  <>
                    <span className="info-value">{salonData.description}</span>
                    {isEditing && (
                      <button onClick={() => startEditingField('description')} className='edit-field-button'>✏️</button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="action-buttons">
            {!isEditing ? (
              <button className="edit-button" onClick={handleEditInfo}>
                Edit Information
              </button>
            ) : (
              <>
                <button className="save-button" onClick={handleUpdateInfo}>
                  Save Changes
                </button>
                <button className="cancel-button" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </>
            )}
          </div>
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
          <button className="view-appointments-button" onClick={() => {
            // call the AppointmentsModal component
            setShowAppointmentsModal(true);
            //fetchAppointments();
          }}
          >
            View Appointments
          </button>

          {/* Render the modal when showAppointmentsModal is true */}
          {showAppointmentsModal && (
            <AppointmentsModal onClose={() => setShowAppointmentsModal(false)} />
          )}

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