const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema({
  salon_id: { type: Number, required: true, unique: true }, // تم تغييره إلى Number وإضافة unique: true بناءً على المفتاح الأساسي INT
  owner_email: { type: String, required: true, maxlength: 100 },
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String }, // تم تغييره إلى String ليتوافق مع TEXT (يمكن أن يكون نصًا طويلاً)
  address: { type: String, required: true }, // تم إضافة required: true بناءً على NN
  phone: { type: String, maxlength: 20 },
  logo_url: { type: String, maxlength: 255 },
  created_at: { type: Date, default: Date.now } // تم تغييره ليتوافق مع TIMESTAMP
});

module.exports = mongoose.model('Salon', salonSchema);