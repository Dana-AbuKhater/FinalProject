const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true }, // تم تغيير نوعه إلى Number وإضافة unique: true بناءً على المفتاح الأساسي INT
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, maxlength: 100,unique:true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: Number, required: true, maxlength: 10 },
  gender: { type: String, enum: ['Male', 'Female'] }, // استخدام enum للقيم المحددة
  created_at: { type: Date, default: Date.now },// تم تغيير نوعه ليتوافق مع TIMESTAMP
  userType: { // حقل يحدد نوع المستخدم
    type: String,
    required: true,
    enum: ['salon', 'customer'], // يمكن أن يكون صالون أو كستمر
  }
});

module.exports = mongoose.model('User', userSchema);