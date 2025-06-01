import React, { useEffect, useState } from "react";
//import axios from "axios";
//import ServiceCard from "./ServiceCard";
import "./ManageServices.css";
import { useNavigate } from "react-router-dom";

const ManageServices = () => {
    const [services, setServices] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // خلي الـ salonId ثابت عشان التجربة فقط
    //const salonId = '66567fe567ffe1236aa22ee9';

    useEffect(() => {
        const salonId = localStorage.getItem("id");

        if (!salonId) {
            setError("لم يتم العثور على حساب الصالون، الرجاء تسجيل الدخول.");
            return;
        }

        console.log("salonId ", salonId)
        fetch(`http://localhost:3000/api/services/salon/${salonId}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("فشل في جلب الخدمات.");
                }
                return res.json();
            })
            .then((data) => {
                console.log("data",data);
                setServices(data.services);
            })
            .catch((error) => {
                setError("فشل في جلب الخدمات، تحقق من وجود الخدمات أو الرابط.");
                console.error(error);
            });
    }, []);
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/services/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'فشل في حذف الخدمة.');

            alert(data.message);
            // refresh services list or remove from state here
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };
      

    const handleEdit = (serviceId) => {
        navigate(`/edit-service/${serviceId}`);
    };




    return (
        <div className="container">
            <h2>صفحة إدارة الخدمات</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {services.length === 0 && !error && <p>لا توجد خدمات لعرضها.</p>}

            {services.map((service) => (
                <div className="service-card" key={service._id}>
                    <div className="service-details">
                        <h3>{service.name}</h3>
                        <p>السعر: {service.price} د.أ</p>
                    </div>
                    <div className="service-actions">
                        <button
                            className="edit-btn"
                            onClick={() => handleEdit(service._id)}
                        >
                            تعديل
                        </button>
                        <button
                            className="delete-btn"
                            onClick={() => handleDelete(service._id)}
                        >
                            حذف
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ManageServices;
