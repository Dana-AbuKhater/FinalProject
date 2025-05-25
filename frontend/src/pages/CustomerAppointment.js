import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomerAppointments.css";

export default function CustomerAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/appointments/1"
        ); // مثال: ID الكستمور = 1
        const data = await response.json();
        if (data.success) {
          setAppointments(data.result);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="appointments-container">
      <h1 className="appointments-title">My Appointments</h1>
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : !appointments || appointments.length === 0 ? (
        <p className="no-appointments">No appointments found.</p>
      ) : (
        <div className="appointments-grid">
          {appointments.map((appt, index) => (
            <div key={index} className="appointment-card">
              <h2 className="appointment-header">
                Appointment #{appt.Appointment_id || index + 1}
              </h2>
              <p className="appointment-info">👤 User ID: {appt.user_id}</p>
              <p className="appointment-info">🏢 Salon ID: {appt.salon_id}</p>
              <p className="appointment-info">
                💇 Service ID: {appt.service_id}
              </p>
              <p className="appointment-info">🕒 Time: 14:00 - 15:00</p>
              <p className="appointment-status">
                📅 Status:
                <span
                  className={`status-text ${
                    appt.status === "Confirmed"
                      ? "status-confirmed"
                      : appt.status === "Cancelled"
                        ? "status-cancelled"
                        : "status-pending"
                  }`}
                >
                  {appt.status}
                </span>
              </p>
              <div className="appointment-date-picker">
                <DatePicker selected={new Date("10-05-2025")} inline disabled />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
