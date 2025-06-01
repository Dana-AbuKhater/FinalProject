import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditService.css";

function EditService() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState({
        name: "",
        price: "",
        image: ""
    });

    const fetchService = async () => {
        const res = await axios.get(`http://localhost:3000/api/services/${id}`);
        setService(res.data);
    };

    useEffect(() => {
        fetchService();
    }, []);

    const handleChange = (e) => {
        setService({ ...service, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.put(`http://localhost:3000/api/services/${id}`, service);
        alert("تم تحديث الخدمة بنجاح!");
        navigate("/manage-services");
    };

    return (
        <div className="add-service-form-container">
            <form onSubmit={handleSubmit} className="add-service-form">
                <h1 className="form-title">تعديل الخدمة</h1>

                {/* Service Name */}
                <div className="form-group">
                    <label>اسم الخدمة:</label>
                    <input
                        type="text"
                        value={service.name}
                        onChange={(e) => setService({ ...service, name: e.target.value })}
                        required
                    />
                </div>

                {/* Price */}
                <div className="form-group">
                    <label>السعر:</label>
                    <input
                        type="number"
                        value={service.price}
                        onChange={(e) => setService({ ...service, price: e.target.value })}
                        required
                    />
                </div>

                {/* Discount */}
                <div className="form-group">
                    <label>الخصم:</label>
                    <input
                        type="number"
                        value={service.discount}
                        onChange={(e) => setService({ ...service, discount: e.target.value })}
                    />
                </div>

                {/* Duration */}
                <div className="form-group">
                    <label>المدة (بالدقائق):</label>
                    <input
                        type="number"
                        value={service.duration}
                        onChange={(e) => setService({ ...service, duration: e.target.value })}
                    />
                </div>

                {/* Description */}
                <div className="form-group">
                    <label>الوصف:</label>
                    <textarea
                        value={service.description}
                        onChange={(e) => setService({ ...service, description: e.target.value })}
                    />
                </div>

                {/* Category */}
                <div className="form-group">
                    <label>الفئة:</label>
                    <select
                        value={service.category}
                        onChange={(e) => setService({ ...service, category: e.target.value })}
                    >
                        <option value="">اختيار الفئة</option>
                        <option value="hair">شعر</option>
                        <option value="nails">أظافر</option>
                        <option value="skin">بشرة</option>
                        <option value="other">أخرى</option>
                    </select>
                </div>

                {/* Status */}
                <div className="form-group">
                    <label>الحالة:</label>
                    <select
                        value={service.status}
                        onChange={(e) => setService({ ...service, status: e.target.value })}
                    >
                        <option value="visible">ظاهرة</option>
                        <option value="hidden">مخفية</option>
                        <option value="deleted">محذوفة</option>
                    </select>
                </div>

                <button type="submit" className="submit-button">
                    حفظ التعديلات
                </button>
            </form>
        </div>
      );
}

export default EditService;
