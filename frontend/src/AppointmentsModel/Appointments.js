// components/AppointmentsModal.jsx
import { useState, useEffect } from 'react';

const AppointmentsModal = ({ onClose }) => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch appointments when modal opens
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
                // Replace with your actual API call
                fetch('http://localhost:3000/api/appointments/getappointments', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                        // Add any other headers you need, like authorization
                    },
                })
                    .then(response => {
                        console.log("============================================");
                        console.log("Response from API:", response);
                        return response.json()
                    })
                    .then(res => {
                        console.log("============================================");
                        console.log("Appointments fetched:", res.data);
                        setAppointments(res.data);
                    })
                    .catch(error => {
                        console.error('Error fetching appointments:', error);
                        setAppointments([]);
                    });
                // // Example API call to fetch appointments
                // const response = await fetch('/api/appointments/getappointments');
                // console.log("==================================================================");
                // console.log("Response from API:", response);
                // console.log("Response JSON from API:", await response.json());
                // const data = await response.json();
                // setAppointments(data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    return (
        <div className="appointments-modal">
            <div className="modal-content">
                <h2>Customer Appointments</h2>
                <button
                    className="close-button"
                    onClick={onClose}
                >
                    ×
                </button>

                {isLoading ? (
                    <p>Loading appointments...</p>
                ) : appointments.length == 0 ? (
                    <p>No appointments found.</p>
                ) : (
                    <div className="appointments-list">
                        {appointments.map(appointment => (
                            <div key={appointment.id} className="appointment-card">
                                <h3>{appointment.customerName}</h3>
                                <div className="service-details">
                                    <p><strong>Service:</strong> {appointment.serviceName}</p>
                                    <p><strong>Description:</strong> {appointment.description}</p>
                                    <p><strong>Date:</strong> {(appointment.date).split('T')[0]}</p>
                                    <p><strong>Time:</strong> {appointment.startTime} - {appointment.endTime}</p>
            
                                    <p><strong>Price:</strong> {appointment.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentsModal;