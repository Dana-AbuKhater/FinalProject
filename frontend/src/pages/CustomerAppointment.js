import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
        console.log("data is:" + data.success);
        if (data.success) {
          console.log("success fetching appointments:");
          setAppointments(data.result);
        } else {
          console.error("Error  appointments:");
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
    <div className="min-h-screen bg-pink-50 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-pink-700">
        My Appointments
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : !appointments || appointments.length === 0 ? (
        <p className="text-center text-gray-500">No appointments found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map((appt, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded shadow flex flex-col space-y-2"
            >
              <h2 className="text-lg font-semibold text-pink-700">
                Appointment #{appt.Appointment_id || index + 1}
              </h2>
              <p className="text-sm">👤 User ID: {appt.user_id}</p>
              <p className="text-sm">🏢 Salon ID: {appt.salon_id}</p>
              <p className="text-sm">💇 Service ID: {appt.service_id}</p>
              <p className="text-sm">
                🕒 Time: {"14:00"} - {"15:00"}
              </p>
              <p className="text-sm">
                📅 Status:{" "}
                <span
                  className={`font-semibold ${appt.status === "Confirmed" ? "text-green-600" : appt.status === "Cancelled" ? "text-red-600" : "text-yellow-600"}`}
                >
                  {appt.status}
                </span>
              </p>
              <div className="mt-2">
                <DatePicker selected={new Date("10-05-2025")} inline disabled />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
