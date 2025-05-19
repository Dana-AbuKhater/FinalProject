import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SalonInfoForm.css";
import Calendar from "../InteractiveCalendar/Calendar";

const SalonInfoForm = () => {
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const [salonInfo, setSalonInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    workingHours: "",
    description: "",
    serviceType: "salon-only",
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
  });

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // حالة التحميل

  useEffect(() => {
    const storedServices = JSON.parse(localStorage.getItem("services")) || [];
    setServices(storedServices);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const address = e.target.address.value;
    const workingHours = e.target.workingHours.value;
    const serviceType = e.target.serviceType.value;
    const website = e.target.website.value;
    const description = e.target.description.value;
    const id = localStorage.getItem("salonId");
    console.log("id= ", id);
    /**try {
      const token = localStorage.getItem('token');
      await axios.put('/api/salon/info', salonInfo, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Salon info updated successfully!');
    } catch (error) {
      alert(error.response.data.error);
    }**/
    const endpoint = `http://localhost:3000/api/salons/${id}`;
    const token = localStorage.getItem("token");
    const query = `?address=${address}&workingHours=${workingHours}&serviceType=${serviceType}&website=${website}&description=${description}`;
    const url = endpoint + query;
    if (!token) {
      alert("Token not found");
      return;
    }
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(salonInfo),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Salon info updated successfully!");
          navigate("/SalonInfoForm");
        } else {
          alert(data.message || "Update failed");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("An error occurred during update");
      });
  };

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
    fetchSalonData();
  }, []);

  const fetchSalonData = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token= ", token);
      const response = await fetch("/api/salon/info", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // التحقق من الـ status code
      if (!response.ok) {
        throw new Error(
          `API error: ${response.status} - ${response.statusText}`
        );
      }

      // تحقق من نوع المحتوى
      // const contentType = response.headers.get('Content-Type');
      //console.log('Content-Type:', contentType); // طباعة نوع المحتوى للتأكد من أنه JSON
      console.log("Response Headers:", response.headers); // طباعة جميع الهيدرز
      console.log("Response:", response); // طباعة الاستجابة بالكامل
      const salonId = localStorage.getItem("salonId");
      const salonName = localStorage.getItem("salonName");
      const salonEmail = localStorage.getItem("salonEmail");
      const salonPhone = localStorage.getItem("salonPhone");
      console.log("salonId= ", salonId);
      console.log("salonName= ", salonName);
      console.log("salonEmail= ", salonEmail);
      console.log("salonPhone= ", salonPhone);
      const data = await response.json();
      //console.log('Salon Data:', data); // طباعة البيانات المسترجعة
      setSalonInfo(data.user);

      // if (contentType && contentType.includes('application/json')) {
      //   const data = await response.json(); // تحويل الاستجابة إلى JSON
      //   if (data && data.name) {
      //     setSalonInfo(data);
      //   } else {
      //     console.error('لم يتم  العثور على بيانات الصالون');
      //   }
      // } else {
      //   console.error('الاستجابة ليست بتنسيق JSON:', contentType);
      //   const text = await response.text(); // طباعة النص للاستجابة للتأكد من محتواها
      //   //console.log('Response body:', text);
      // }
    } catch (error) {
      console.error("خطأ في جلب بيانات الصالون:", error);
    } finally {
      setIsLoading(false); // بمجرد الانتهاء من جلب البيانات، نوقف حالة التحميل
    }
  };

  return (
    <div className="salon-form-container">
      <form onSubmit={handleSubmit} className="salon-form">
        {/* 👇 عرض رسالة التحميل إذا كانت البيانات ما زالت تُحمّل */}
        <h1 className="salon-form-title">
          {isLoading ? "Loading..." : `Hi ${salonInfo.name}`}
        </h1>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            value={salonInfo.address}
            onChange={(e) =>
              setSalonInfo({ ...salonInfo, address: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Working Hours</label>
          <input
            type="text"
            placeholder="e.g., 9 AM - 6 PM"
            value={salonInfo.workingHours}
            onChange={(e) =>
              setSalonInfo({ ...salonInfo, workingHours: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Service Type</label>
          <select
            value={salonInfo.serviceType}
            onChange={(e) =>
              setSalonInfo({ ...salonInfo, serviceType: e.target.value })
            }
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
            onChange={(e) =>
              setSalonInfo({ ...salonInfo, website: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={salonInfo.description}
            onChange={(e) =>
              setSalonInfo({ ...salonInfo, description: e.target.value })
            }
          />
        </div>

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
          </div>
        </div>

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
