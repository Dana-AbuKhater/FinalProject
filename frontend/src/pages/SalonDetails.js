import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

export default function SalonDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchSalonDetails = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/salons/${id}`);
        const data = await res.json();
        if (data.success) {
          setSalon(data.salon);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error fetching salon details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalonDetails();
  }, [id]);

  const handleAddAppointment = async () => {
    const appointmentData = {
      user_id: 1, // عدلها حسب المستخدم الحالي
      salon_id: salon.salon_id, // يجب أن يكون متوفر عندك
      service_id: 3, // يجب أن يكون متوفر عندك
      Appointment_date: selectedDate,
      start_time: "10:00", // عدل حسب اختيار المستخدم أو حسب logic معين
      end_time: "11:00", // مثلاً ساعة واحدة بعد البدء
      // status: "Pending", // اختياري لأن له default
    };

    try {
      const response = await fetch("http://localhost:3000/api/appointments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error("Failed to add appointment");
      }

      const data = await response.json();
      console.log("Appointment added:", data);

      setShowModal(false);
      navigate("/CustomerAppointment");
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!salon) return <div className="p-4">Salon not found.</div>;

  return (
    <div className="min-h-screen bg-pink-100 p-4">
      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 bg-gray-200 rounded">
            <img
              src={salon.logo_url}
              alt={`${salon.name} logo`}
              className="object-cover w-full h-full rounded"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{salon.name}</h2>
            <div className="flex text-yellow-500">
              {Array.from({ length: salon.rating || 0 }).map((_, i) => (
                <Star key={i} size={16} fill="gold" stroke="gold" />
              ))}
            </div>
            <p className="text-sm text-gray-600">{salon.description}</p>
            <p className="text-sm">📞 {salon.phone}</p>
            <p className="text-sm">📍 {salon.address}</p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-6 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
        >
          Add Appointment
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Add Appointment
            </h2>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              inline
            />
            <button
              onClick={handleAddAppointment}
              className="mt-4 w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
            >
              Confirm Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
