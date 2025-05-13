const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const appointments = [
  {
    salon_id: 3,
    customer_id: 1,
    time: "10-05-2025 18:00",
    status: "Pending",
    services: [
      {
        id: 1,
        price: 200.0,
        price_after_discount: 150.0,
        service_name: "Makeup",
      },
      {
        id: 2,
        price: 50.0,
        price_after_discount: 50.0,
        service_name: "Protein",
      },
    ],
  },
  {
    salon_id: 2,
    customer_id: 2,
    time: "11-05-2025 13:00",
    status: "Pending",
    services: [
      {
        id: 4,
        price: 20.0,
        price_after_discount: 20.0,
        service_name: "Hair",
      },
      {
        id: 3,
        price: 10.0,
        price_after_discount: 7.0,
        service_name: "Nails",
      },
    ],
  },
];
router.get("/:customer_id", async (req, res) => {
  // const Appointments = await Appointment.find().populate('customer salon service');
  const customerId = parseInt(req.params.customer_id);

  const appts = appointments.find((s) => s.customer_id === customerId);
  if (!appts) {
    return res.status(404).json({
      success: false,
      message: "appointments not found",
    });
  }
  const result = Array.isArray(appts) ? appts : [appts];

  res.status(200).json({ success: true, result });
});

router.post("/", async (req, res) => {
  const newAppointment = new Appointment(req.body);

  // await newAppointment.save();
  res.status(201).json({ success: true, appointment: newAppointment });
});

module.exports = router;
