const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

router.get('/', async (req, res) => {
  const services = await Service.find().populate('salon');
  res.json(services);
});

router.post('/', async (req, res) => {
  const newService = new Service(req.body);
  await newService.save();
  res.status(201).json(newService);
});

module.exports = router;