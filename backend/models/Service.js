const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  service_id: { type: Number, required: true, unique: true }, // مفتاح أساسي، يجب أن يكون فريدًا
  salon_id: { type: Number, required: true }, // مفتاح أجنبي يشير إلى جدول الصالونات
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String }, // يمكن أن يكون نصًا طويلاً
  price: { type: Number, required: true }, // استخدام Number لـ DECIMAL
  duration_minutes: { type: Number, required: true }, // عدد صحيح للدقائق
  category: { type: String, maxlength: 50 },
  is_discounted: { type: Boolean, default: false }, // قيمة افتراضية لـ BOOLEAN
  discount_price: { type: Number } ,// استخدام Number لـ DECIMAL
  status: {
    type: String,
    enum: ['visible', 'hidden', 'deleted'], // القيم المسموح بها
    default: 'visible' // شالقيمة الافتراضية إذا لم يتم تحديدها
  }
});

module.exports = mongoose.model('Service', serviceSchema);