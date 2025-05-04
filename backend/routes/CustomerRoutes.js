const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

router.get('/', async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

router.post('/', async (req, res) => {
  const newCustomer = new Customer(req.query);
  await newCustomer.save();
  res.status(201).json(newCustomer);
});

module.exports = router;