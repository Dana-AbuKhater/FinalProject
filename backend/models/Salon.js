const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema({
  salon_id: { type: Number, required: true, unique: true },
  owner_email: { type: String, required: true, maxlength: 100, unique: true },
  name: { type: String, required: true, maxlength: 100 },
  password: { type: String, required: true, minlength: 6 },
  type: { type: String, required: true, enum: ['salon'] },
  description: { type: String },
  address: { type: String },
  phone: { type: Number, maxlength: 10, required: true },
  logo_url: { type: String, maxlength: 255 },
  created_at: { type: Date, default: Date.now },
  workingHours: { type: String },

});


module.exports = mongoose.model('Salon', salonSchema);