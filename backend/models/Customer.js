const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true }, // تم تغيير نوعه إلى Number وإضافة unique: true بناءً على المفتاح الأساسي INT
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, maxlength: 100 },
  password: { type: String, required: true, maxlength: 255 },
  phone: { type: String, required: true, maxlength: 20 },
  gender: { type: String, enum: ['Male', 'Female'] }, // استخدام enum للقيم المحددة
  created_at: { type: Date, default: Date.now } // تم تغيير نوعه ليتوافق مع TIMESTAMP
});

module.exports = mongoose.model('User', userSchema);