// src/components/SalonDetails.jsx
import React, { useEffect, useState, Link } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SalonDetails.css"; // استيراد ملف CSS الجديد

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
        const res = await fetch(`http://localhost:3000/api/salon/${id}`);
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
      user_id: 1,
      salon_id: salon.salon_id,
      service_id: 3,
      Appointment_date: selectedDate,
      start_time: "10:00",
      end_time: "11:00",
    };

    try {
      const response = await fetch("http://localhost:3000/api/appointments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) throw new Error("Failed to add appointment");

      const data = await response.json();
      console.log("Appointment added:", data);
      setShowModal(false);
      navigate("/CustomerAppointment");
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!salon) return <div className="not-found">Salon not found.</div>;

  return (

    <div className="salon-page">
      <div className="back-button-container">
        <Link to="/SalonDashboard">
          <button className="back-button">←</button>
        </Link>
      </div>
      <div className="salon-card">
        <div className="salon-header">
          <div className="salon-logo">
            <img src={salon.logo_url} alt={`${salon.name} logo`} />
          </div>
          <div className="salon-info">
            <h2 className="salon-name">{salon.name}</h2>
            <div className="salon-rating">
              {Array.from({ length: salon.rating || 0 }).map((_, i) => (
                <Star key={i} size={16} fill="gold" stroke="gold" />
              ))}
            </div>
            <p className="salon-description">{salon.description}</p>
            <p className="salon-phone">📞 {salon.phone}</p>
            <p className="salon-address">📍 {salon.address}</p>
          </div>
        </div>

        <button className="appointment-btn" onClick={() => setShowModal(true)}>
          Add Appointment
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ✕
            </button>
            <h2 className="modal-title">Add Appointment</h2>
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              inline
            />
            <button className="confirm-btn" onClick={handleAddAppointment}>
              Confirm Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
