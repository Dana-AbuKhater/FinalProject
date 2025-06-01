import React from "react";
import { useNavigate } from "react-router-dom";

function ServiceCard({ service, onDelete }) {
    const navigate = useNavigate();

    const handleDelete = () => {
        if (window.confirm("هل أنت متأكد من حذف الخدمة؟")) {
            onDelete(service._id);
        }
    };

    return (
        <div className="border rounded p-4 flex items-center justify-between mb-3 shadow">
            <div className="flex items-center gap-4">
                <img src={service.image} alt={service.name} className="w-24 h-24 object-cover rounded" />
                <div>
                    <h2 className="text-lg font-bold">{service.name}</h2>
                    <p className="text-gray-600">{service.price} دينار</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => navigate(`/edit-service/${service._id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                    تعديل
                </button>
                <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                >
                    حذف
                </button>
            </div>
        </div>
    );
}

export default ServiceCard;
