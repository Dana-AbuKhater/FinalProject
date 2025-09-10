import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // التحقق من أن الحقول المطلوبة مليئة
    if (!service.name || !service.price) {
      alert('Please fill in all required fields (Name and Price).');
      return;
    }

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

    // إعادة التوجيه إلى الفورم الرئيسي
    navigate('/salon-info');
  };

  return (
    <div className="add-service-form-container">
      <form onSubmit={handleSubmit} className="add-service-form">
        <h1 className="form-title">Add New Service</h1>

        {/* Service Name */}
        <div className="form-group">
          <label>Service Name:</label>
          <input
            type="text"
            placeholder="e.g., Haircut"
            value={service.name}
            onChange={(e) => setService({ ...service, name: e.target.value })}
            required
          />
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
        <div className="form-group">
          <label>Status:</label>
          <select
            value={service.status}
            onChange={(e) => setService({ ...service, status: e.target.value })}
          >
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button"  >
          Add Service
        </button>
      </form>
    </div>
  );
};

export default AddServiceForm;