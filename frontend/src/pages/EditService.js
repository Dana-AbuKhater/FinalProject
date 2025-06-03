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
        image: "",
        discount_price: 0, // لازم نفس اسم الداتابيز
        duration_minutes: 0, // لازم نفس اسم الداتابيز
        description: "",
        category: "",
        status: "visible"
    });


    const fetchService = async () => {
        const res = await axios.get(`http://localhost:3000/api/services/${id}`);
        console.log("data ", res.data)
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
                <h1 className="form-title">Edit Service </h1>
                {/* Category */}
                <div className="form-group">
                    <label>Category:</label>
                    <select
                        type="String"
                        value={service.category}
                        onChange={(e) => setService({ ...service, category: e.target.value })}
                    >
                        <option value="">اختيار الفئة</option>
                        <option value="hair">Hair</option>
                        <option value="nails">Nails</option>
                        <option value="skin">Skin</option>
                        <option value="other">Other</option>
                    </select>
                </div>
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
                        value={service.price}
                        onChange={(e) => {
                            const value = e.target.value;
                            // يمنع إدخال القيم السالبة مع السماح بمسح الحقل
                            if (value === '' || (Number(value) >= 0 && /^\d*\.?\d*$/.test(value))) {
                                setService({ ...service, price: value });
                            }
                        }}
                        onKeyDown={(e) => {
                            // يمنع كتابة علامة السالب والنقطتين (للأرقام العلمية)
                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                e.preventDefault();
                            }
                        }}
                          min="0"
                        required
                    />
                </div>

                {/* Discount */}
                <div className="form-group">
                    <label>Discount:</label>
                    <input

                        type="number"
                        value={service.discount_price}
                        onChange={(e) => {
                            const value = e.target.value;
                            // يمنع إدخال القيم السالبة مع السماح بمسح الحقل
                            if (value === '' || (Number(value) >= 0 && /^\d*\.?\d*$/.test(value))) {
                                setService({ ...service, discount_price: value });
                            }
                        }}
                        onKeyDown={(e) => {
                            // يمنع كتابة علامة السالب والنقطتين (للأرقام العلمية)
                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                e.preventDefault();
                            }
                        }}
                        min="0"
                    />
                </div>

                {/* Duration */}
                <div className="form-group">
                    <label>Duration (minutes):</label>
                    <input
                        type="number"
                        value={service.duration_minutes}
                        onChange={(e) => setService({ ...service, duration_minutes: e.target.value })}
                    />
                </div>

                {/* Description */}
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        type="String"
                        value={service.description}
                        onChange={(e) => {
                            const value = e.target.value;
                            // يمنع إدخال القيم السالبة مع السماح بمسح الحقل
                            if (value === '' || (Number(value) >= 0 && /^\d*\.?\d*$/.test(value))) {
                                setService({ ...service, duration: value });
                            }
                        }}
                        onKeyDown={(e) => {
                            // يمنع كتابة علامة السالب والنقطتين (للأرقام العلمية)
                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                e.preventDefault();
                            }
                        }}
                          min="0"
                    />
                </div>

              
                <button type="submit" className="submit-button">
                    Save Changes                </button>
            </form>
        </div>
    );
}

export default EditService;
