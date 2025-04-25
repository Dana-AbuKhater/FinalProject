const express = require('express');
const router = express.Router();
const Salon = require('../models/Salon');

router.get('/', async (req, res) => {
  const salons = await Salon.find().populate('services');
  res.json(salons);
});

router.post('/', async (req, res) => {
  const newSalon = new Salon(req.body);
  await newSalon.save();
  res.status(201).json(newSalon);
});

module.exports = router;