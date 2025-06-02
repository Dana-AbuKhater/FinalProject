const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  Appointment_id: { type: Number, required: true, unique: true }, // مفتاح أساسي، يجب أن يكون فريدًا
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // مفتاح أجنبي يشير إلى جدول المستخدمين
  salon_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Salon' }, // مفتاح أجنبي يشير إلى جدول الصالونات
  service_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Service' }, // مفتاح أجنبي يشير إلى جدول الخدمات
  Appointment_date: { type: Date, required: true }, // لتخزين التاريخ
  start_time: { type: String, required: true }, // لتخزين الوقت كسلسلة نصية (يمكن استخدام Date إذا كنت بحاجة إلى عمليات وقت أكثر تعقيدًا)
  end_time: { type: String, required: true }, // لتخزين الوقت كسلسلة نصية
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' }, // استخدام enum للقيم المحددة وقيمة افتراضية
  created_at: { type: Date, default: Date.now } // لتسجيل وقت الإنشاء
});

module.exports = mongoose.model('Appointment', AppointmentSchema);