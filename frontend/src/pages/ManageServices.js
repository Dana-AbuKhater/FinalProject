import React, { useEffect, useState } from "react";
import "./ManageServices.css";
import {Link, useNavigate } from "react-router-dom";

const ManageServices = () => {
    const [services, setServices] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchServices = () => {
        const salonId = localStorage.getItem("id");

        if (!salonId) {
            setError("لم يتم العثور على حساب الصالون، الرجاء تسجيل الدخول.");
            return;
        }

        fetch(`http://localhost:3000/api/services/salon/${salonId}`)
            .then((res) => {
                /*  if (!res.ok) {
                      throw new Error("فشل في جلب الخدمات.");
                  }*/
                return res.json();
            })
            .then((data) => {
                console.log("data ", data);
                if (data.services) { setServices(data.services); }
                else {
                    data.services = []
                    setServices(data.services)
                }

                setError(null);
            })
        /*.catch((error) => {
            console.error(error);
            setError("فشل في جلب الخدمات، تحقق من وجود الخدمات أو الرابط.");
        });*/
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleDelete = async (id) => {
        // Show confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this service?");
        if (!confirmDelete) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/services/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'فشل في حذف الخدمة.');

            alert(data.message);

            // Refresh the list
            fetchServices();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const handleEdit = (serviceId) => {
        navigate(`/edit-service/${serviceId}`);
    };

    return (
        <div className="manage-services">
            <div className="back-button-container">
                <Link to="/SalonDashboard">
                    <button className="back-button">←</button>
                </Link>
            </div>
        <div className="container">
            <h2>Service Management Page</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {services.length === 0 && !error && <p>No services to display</p>}

            {services.map((service) => (
                <div className="service-card" key={service._id}>
                    <div className="service-details">
                        <h3>{service.name}</h3>
                        <p>Price: {service.price} د.أ</p>
                    </div>
                    <div className="service-actions">
                        <button className="edit-btn" onClick={() => handleEdit(service._id)}>
                            Edit
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(service._id)}>
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
        </div>
    );
};

export default ManageServices;