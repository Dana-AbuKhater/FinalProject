const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  salon: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rating', ratingSchema);