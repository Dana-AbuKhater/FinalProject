const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');
// Get all appointments
router.get('/', async (req, res) => {
  const Appointments = await Appointment.find().populate('customer salon service');
  res.json(Appointments);
});
// Create new appointment
router.post('/', async (req, res) => {
  const newAppointment = new Appointment(req.body);
  await newAppointment.save();
  res.status(201).json(newAppointment);
});
// Get number of appointments for a specific salon
router.get('/count/:salon_id', async (req, res) => {
  try {
    const salonId = req.params.salon_id;
    console.log("Received salon ID in backend:", salonId); // أضف هذا السطر

    if (!mongoose.Types.ObjectId.isValid(salonId)) {
      return res.status(400).json({ error: 'Invalid salon ID' });
    }

    console.log("Searching for appointments with salon_id:", salonId); // <--- أضف هذا

    const count = await Appointment.countDocuments({ salon_id: salonId });
    console.log("Found appointments count:", count); // <--- أضف هذا

    res.status(200).json({
      salon_id: salonId,
      total_appointments: count
    });
  } catch (err) {
    console.error("Error fetching appointments count for salon:", err); // ADD THIS LINE

    res.status(500).json({ message: 'Server error', error: err });
  }
});
/*
//ممكن نحطه مع الكالندر انه كل يوم كم حجز عنده 
// Get number of appointments for a specific salon on a specific day
router.get('/count/:salon_id/:date', async (req, res) => {
  try {
    const salonId = parseInt(req.params.salon_id);
    const selectedDate = new Date(req.params.date);

    // بداية ونهاية اليوم
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

    const count = await Appointment.countDocuments({
      salon_id: salonId,
      Appointment_date: { $gte: startOfDay, $lte: endOfDay }
    });

    res.status(200).json({
      salon_id: salonId,
      date: startOfDay.toISOString().split('T')[0],
      total_appointments: count
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});*/

module.exports = router;