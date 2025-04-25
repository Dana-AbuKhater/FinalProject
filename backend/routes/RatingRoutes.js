const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');

router.get('/', async (req, res) => {
  const ratings = await Rating.find().populate('customer salon');
  res.json(ratings);
});

router.post('/', async (req, res) => {
  const newRating = new Rating(req.body);
  await newRating.save();
  res.status(201).json(newRating);
});

module.exports = router;