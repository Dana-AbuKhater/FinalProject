const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/Customer'); // موديل المستخدم (لجلب تفاصيل العميل)

const mongoose = require('mongoose');
// Get all appointments
router.get('/', async (req, res) => {
  const Appointments = await Appointment.find().populate('customer salon service');
  res.json(Appointments);
});/*
// Create new appointment
router.post('/', async (req, res) => {
  const newAppointment = new Appointment(req.body);
  await newAppointment.save();
  res.status(201).json(newAppointment);
});*/
router.get('/', async (req, res) => {
  try {
    // هنا نستخدم populate لجلب تفاصيل العميل والخدمة
    // تأكد من أن اسم الحقل في Appointment هو 'customerId' أو 'userId' حسب السكيما الفعلية لديك
    const appointments = await Appointment.find()
      // إذا كان اسم الحقل في Appointment هو customerId
      .populate('customerId', 'name email phone user_id')
      // إذا كان اسم الحقل في Appointment هو userId
      // .populate('userId', 'name email phone user_id')
      .populate('serviceId', 'name description price duration_minutes service_id')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    // تصفية المواعيد التي قد لا يكون العميل أو الخدمة موجودين لها (مثلاً إذا تم حذفهم)
    const validAppointments = appointments.filter(
      // استخدم appointment.customerId إذا كان هو الاسم في السكيما، أو appointment.userId
      (appointment) => (appointment.customerId || appointment.userId) && appointment.serviceId
    );

    res.status(200).json({
      success: true,
      count: validAppointments.length,
      data: validAppointments,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not retrieve appointments',
    });
  }
});

// @desc    Get a single appointment by ID with customer and service details
// @route   GET /api/appointments/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      // إذا كان اسم الحقل في Appointment هو customerId
      .populate('customerId', 'name email phone user_id')
      // إذا كان اسم الحقل في Appointment هو userId
      // .populate('userId', 'name email phone user_id')
      .populate('serviceId', 'name description price duration_minutes service_id');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    if (!(appointment.customerId || appointment.userId) || !appointment.serviceId) {
      return res.status(404).json({
        success: false,
        error: 'Related customer or service not found for this appointment',
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error(`Error fetching appointment with ID ${req.params.id}:`, error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'Invalid appointment ID',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error: Could not retrieve appointment',
    });
  }
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