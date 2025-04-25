const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Salon = require('../models/Salon');


// 📝 تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
  const { type, name, phone, email } = req.body;

  try {
    if (type === 'customer') {
      const newCustomer = new Customer({ name, phone, email });
      await newCustomer.save();
      return res.status(201).json({ message: 'Customer registered successfully', user: newCustomer });
    }

    if (type === 'salon') {
      const newSalon = new Salon({ name, phone, email });
      await newSalon.save();
      return res.status(201).json({ message: 'Salon registered successfully', user: newSalon });
    }

    res.status(400).json({ message: 'Invalid type' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});


// 📝 تسجيل دخول
router.post('/login', async (req, res) => {
  const { type, email } = req.body;

  try {
    if (type === 'customer') {
      const customer = await Customer.findOne({ email });
      if (!customer) return res.status(404).json({ message: 'Customer not found' });
      return res.status(200).json({ message: 'Customer login successful', user: customer });
    }

    if (type === 'salon') {
      const salon = await Salon.findOne({ email });
      if (!salon) return res.status(404).json({ message: 'Salon not found' });
      return res.status(200).json({ message: 'Salon login successful', user: salon });
    }

    res.status(400).json({ message: 'Invalid type' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

module.exports = router;