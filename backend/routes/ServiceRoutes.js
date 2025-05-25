const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

/*
router.get('/', async (req, res) => {
  const services = await Service.find().populate('salon');
  res.json(services);
});*/

/*router.post('/', async (req, res) => {
  const newService = new Service(req.body);
  await newService.save();
  res.status(201).json(newService);
});*/
// مسار GET لجلب الخدمات لصالون معين باستخدام salon_id
router.get('/salon/:salonId', async (req, res) => {
  try {
    const salonId = parseInt(req.params.salonId, 10); // تحويل salonId من string إلى number

    // التحقق من أن salonId رقم صحيح
    if (isNaN(salonId)) {
      return res.status(400).json({ message: 'معرف الصالون غير صالح.' });
    }

    // البحث عن جميع الخدمات التي تتطابق مع salon_id المحدد
    const services = await Service.find({ salon_id: salonId });

    // إذا لم يتم العثور على خدمات لهذا الصالون
    if (!services || services.length === 0) {
      return res.status(404).json({ message: 'لم يتم العثور على خدمات لهذا الصالون.' });
    }

    // إرسال قائمة الخدمات كاستجابة
    res.status(200).json({ services: services });

  } catch (error) {
    console.error('خطأ في جلب الخدمات للصالون:', error);
    res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
  }
});

// مسار POST لإضافة خدمة جديدة
router.post('/', async (req, res) => {
  try {
    const { name, price, discount, duration, description, category, status } = req.body;

    // تحويل البيانات إلى الأنواع الصحيحة
    const parsedPrice = parseFloat(price);
    const parsedDiscount = parseFloat(discount);
    const parsedDuration = parseInt(duration, 10);

    // تحقق أساسي من البيانات المطلوبة بعد التحويل
    if (!name || isNaN(parsedPrice)) { // التحقق من أن السعر رقم
      return res.status(400).json({ message: 'اسم الخدمة والسعر (رقم صحيح) مطلوبان.' });
    }

    // --- اعتبارات مهمة لـ service_id و salon_id ---
    const lastService = await Service.findOne().sort({ service_id: -1 });
    const service_id = lastService ? lastService.service_id + 1 : 1;
    const salon_id = 1; // قيمة افتراضية، يجب استبدالها بمنطق الحصول على ID الصالون الفعلي

    // إنشاء كائن خدمة جديد بناءً على الـ Schema الخاص بك
    const newService = new Service({
      service_id,
      salon_id,
      name,
      price: parsedPrice,
      duration_minutes: parsedDuration, // ربط حقل 'duration' بـ 'duration_minutes'
      description,
      category,
      is_discounted: parsedDiscount > 0, // تعيين لـ true إذا كان هناك خصم
      discount_price: parsedDiscount > 0 ? parsedDiscount : undefined // تخزين قيمة الخصم فقط إذا كان أكبر من صفر
      // ملاحظة: حقل 'status' من الواجهة الأمامية غير موجود مباشرة في الـ Schema الخاص بك.
      // إذا كنت بحاجة لتخزين حالة الخدمة، يجب إضافة حقل 'status' إلى الـ serviceSchema.
      // status: status // إذا أضفت الحقل للـ Schema
    });

    await newService.save(); // حفظ الخدمة الجديدة في قاعدة البيانات
    res.status(201).json({ message: 'تمت إضافة الخدمة بنجاح!', service: newService });
  } catch (error) {
    console.error('خطأ في إضافة الخدمة:', error);
    res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
  }
});
module.exports = router;