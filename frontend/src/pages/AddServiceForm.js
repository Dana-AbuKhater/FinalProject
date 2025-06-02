import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AddServiceForm.css';

const AddServiceForm = ({ setServices }) => {
  const navigate = useNavigate();

  
  const [service, setService] = useState({
    name: '',
    price: 0,
    discount: 0,
    duration: '', // مدة الخدمة
    description: '', // وصف الخدمة
    category: '', // تصنيف الخدمة
    status: 'visible' // حالة الخدمة (ظاهرة، مخفية، محذوفة)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من أن الحقول المطلوبة مليئة
    if (!service.name || !service.price) {
      alert('Please fill in all required fields (Name and Price).');
      return;
    }
    try {
      // جلب التوكن من localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to add a service.');
        return;
      }
      // إرسال الطلب للسيرفر
      const response = await fetch('http://localhost:3000/api/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(service),
    });
      // تحويل الاستجابة لـ JSON
      //const data = await response.json();

      // التحقق من حالة الاستجابة
      if (!response.ok) {
        const errorText = await response.text(); // قراءة الرد كنص خام
        console.error('الباك إند أرجع خطأ (الوضع الخام):', response.status, errorText); // طباعة حالة الرد والنص الخام

        let errorMessage = 'فشل في إضافة الخدمة.'; // رسالة خطأ افتراضية بالعربي
        try {
          // حاول تحويل النص الخام إلى JSON. هذا سينجح إذا كان السيرفر أرجع JSON صحيح.
          const errorData = JSON.parse(errorText);
          // إذا نجح التحويل، استخدم رسالة الخطأ من الـ JSON، أو رسالة الافتراضية
          errorMessage = errorData.message || errorMessage;
        }
        catch (parseError) {
          // إذا فشل تحويل النص الخام إلى JSON (وهنا بيصير الـ SyntaxError الأصلي)،
          // هذا يعني أن الرد كان نصًا عاديًا أو فارغًا أو HTML.
          // استخدم النص الخام كرسالة خطأ إذا كان موجوداً
          errorMessage = errorText || errorMessage;
        }
        alert(errorMessage); // عرض رسالة الخطأ للمستخدم
        return; // توقف تنفيذ الدالة هنا

      }

      // إذا كان الرد OK (200, 201)، قم بتحويله لـ JSON بشكل طبيعي
      const data = await response.json();
      // تحديث قائمة الخدمات
      setServices(prev => [...prev, data.service]);

      // عرض رسالة نجاح
      alert('Service added successfully!');

      // إعادة التوجيه للداشبورد
      navigate('/ManageServices', {
        state: {
          message: "Service added successfully!",
          newService: data.service
        }
      });

    } catch (error) {
      console.error('Error adding service:', error);
      alert('An error occurred while adding the service.');
    }
/*
    // جلب الخدمات الحالية من localStorage
    const existingServices = JSON.parse(localStorage.getItem('services')) || [];

    // إضافة الخدمة الجديدة إلى القائمة
    const newService = {
      id: Date.now(), // إنشاء ID فريد
      ...service
    };
    const updatedServices = [...existingServices, newService];

    // حفظ الخدمات في localStorage
    localStorage.setItem('services', JSON.stringify(updatedServices));

    // تحديث قائمة الخدمات في الصفحة الرئيسية
    setServices(updatedServices);

    // عرض رسالة نجاح
    alert('Service added successfully!');

    navigate('/SalonDashboard', {
      state: {
        message: "Service added successfully!",
        newService: newService // إرسال بيانات الخدمة المضافة إذا لزم الأمر
      }
    });
    // إعادة التوجيه إلى الفورم الرئيسي
    //navigate('/salon-info');*/
  };

  return (
    <div className="add-service-form-container">
      <form onSubmit={handleSubmit} className="add-service-form">
        <h1 className="form-title">Add New Service</h1>

        {/* Service Name */}
        <div className="form-group">
          <label>Service Name:</label>
          <select
            value={service.name}
            onChange={(e) => setService({ ...service, name: e.target.value })}
          >
            <option value="" unselectable=''>Select Service</option>
            <option value="Haircut">Haircut</option>
            <option value="Manicure">Manicure</option>
            <option value="Pedicure">Pedicure</option>
            <option value="Facial">Facial</option>
            <option value="Massage">Massage</option>
            <option value="Makeup">Makeup</option>
            <option value="Waxing">Waxing</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Price */}
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            placeholder="e.g., 30"
            value={service.price}
            onChange={(e) => setService({ ...service, price: e.target.value })}
            required
          />
        </div>

        {/* Discount */}
        <div className="form-group">
          <label>Discount:</label>
          <input
            type="number"
            placeholder="e.g., 10"
            value={service.discount}
            onChange={(e) => setService({ ...service, discount: e.target.value })}
          />
        </div>

        {/* Duration */}
        <div className="form-group">
          <label>Duration (minutes):</label>
          <input
            type="number"
            placeholder="e.g., 60"
            value={service.duration}
            onChange={(e) => setService({ ...service, duration: e.target.value })}
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description:</label>
          <textarea
            placeholder="e.g., A detailed haircut service"
            value={service.description}
            onChange={(e) => setService({ ...service, description: e.target.value })}
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label>Category:</label>
          <select
            value={service.category}
            onChange={(e) => setService({ ...service, category: e.target.value })}
          >
            <option value="">Select Category</option>
            <option value="hair">Hair</option>
            <option value="nails">Nails</option>
            <option value="skin">Skin</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Status */}
        {/* <div className="form-group">
          <label>Status:</label>
          <select
            value={service.status}
            onChange={(e) => setService({ ...service, status: e.target.value })}
          >
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
            <option value="deleted">Deleted</option>
          </select>
        </div> */}

        <button type="submit" className="submit-button">Add Service</button>

      </form>
    </div>
  );
};

export default AddServiceForm;