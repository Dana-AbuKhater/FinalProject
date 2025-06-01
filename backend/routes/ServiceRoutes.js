const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const jwt = require('jsonwebtoken');
const Salon = require('../models/Salon'); // استدعاء موديل الصالون
const { addService, updateServiceStatus } = require('../controllers/serviceController');

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
    //const salonId = parseInt(req.params.salonId, 10); // تحويل salonId من string إلى number
    const salonId = req.params.salonId;
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
/*
router.post('/create', async (req, res) => {
  console.log("🚀🚀 create service API called");
  console.log("📥 البيانات واصلة:", req.body);

  try {
    const newService = new Service(req.body);
    await newService.save();
    res.status(201).json({ success: true, message: "تمت إضافة الخدمة!", data: newService });
  } catch (error) {
    console.error("❌ خطأ أثناء الإضافة:", error);
    res.status(500).json({ success: false, message: "فشل في الإضافة." });
  }
});
*/
/*
// مسار POST لإضافة خدمة جديدة
router.post('/', async (req, res) => {
  try {
    // فك التوكن
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const salonEmail = decoded.email;

    // جلب الصالون من قاعدة البيانات بناء على الإيميل
    const salon = await Salon.findOne({ email: salonEmail });
    if (!salon) return res.status(404).json({ message: 'Salon not found' });

    const salon_id = salon.salon_id; // أو حسب اسم الحقل في الـ Schema تبعك

    console.log('--- Inside POST /api/services ---');
    console.log('Received req.body:', req.body);
    console.log('Received name:', req.body.name);
    console.log('Received price:', req.body.price);
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

    // إنشاء كائن خدمة جديد بناءً على الـ Schema الخاص بك
    const newService = new Service({
      service_id,
      salon_id,
      name,
      price: parseFloat(price),
      duration_minutes: parseInt(duration, 10), // ربط حقل 'duration' بـ 'duration_minutes'
      description,
      category,
      is_discounted: parsedDiscount > 0, // هذا صحيح، parsedDiscount هو رقم
      discount_price: parsedDiscount > 0 ? parsedDiscount : undefined, // هذا صحيح، parsedDiscount هو رقم
      // ملاحظة: حقل 'status' من الواجهة الأمامية غير موجود مباشرة في الـ Schema الخاص بك.
      // إذا كنت بحاجة لتخزين حالة الخدمة، يجب إضافة حقل 'status' إلى الـ serviceSchema.
      status: status // إذا أضفت الحقل للـ Schema
    });

    await newService.save(); // حفظ الخدمة الجديدة في قاعدة البيانات
    console.log('Service successfully saved to DB:', newService);
    res.status(201).json({ message: 'تمت إضافة الخدمة بنجاح!', service: newService });
  } catch (error) {
    console.error('خطأ في إضافة الخدمة:', error);
    res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
  }
});*/
/*
// مسار PUT لتحديث حالة خدمة معينة (مرئية/مخفية/محذوفة)
router.put('/:serviceId', async (req, res) => {
  console.log();
  try {
    const serviceId = parseInt(req.params.serviceId, 10); // تحويل serviceId من string إلى number

    // التحقق من أن serviceId رقم صحيح
    if (isNaN(serviceId)) {
      return res.status(400).json({ message: 'معرف الخدمة غير صالح.' });
    }

    // استخراج الحالة الجديدة من req.body
    // سنقوم بتلقي 'status' مباشرة بدلاً من isActive و isDeleted
    const { status } = req.body;
    console.log("status" , status);
    // التحقق من أن الحالة المرسلة صالحة وفقاً لـ enum
    const validStatuses = ['visible', 'hidden', 'deleted'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'قيمة الحالة غير صالحة. يجب أن تكون visible, hidden, أو deleted.' });
    }

    // بناء كائن التحديث
    const updateFields = {};
    if (status) {
      updateFields.status = status;
    }
    // يمكنك إضافة حقول أخرى هنا إذا كنت تريد تحديثها أيضاً

    // البحث عن الخدمة بواسطة service_id وتحديثها
    const updatedService = await Service.findOneAndUpdate(
      { service_id: serviceId },
      { $set: updateFields },
      { new: true, runValidators: true } // new: true لإرجاع المستند المحدث، runValidators لتطبيق قواعد الـ Schema
    );

    // إذا لم يتم العثور على الخدمة
    if (!updatedService) {
      return res.status(404).json({ message: 'الخدمة غير موجودة.' });
    }

    res.status(200).json({ message: 'تم تحديث حالة الخدمة بنجاح!', service: updatedService });

  } catch (error) {
    console.error('خطأ في تحديث حالة الخدمة:', error);
    res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
  }
});*/

// تحديث حالة خدمة
router.put('/services/:id/status', updateServiceStatus);

// إضافة خدمة جديدة
router.post('/', addService);
/*
router.get("/salon/:salonId", async (req, res) => {
  const salonId = req.params.salonId;
  console.log("eman");
  const services = await Service.find({ _id: salonId });

  res.status(200).json({ services });
});*/

// delete service
router.delete("/:id", async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: "Service deleted" });
});

// get service by id
router.get("/:id", async (req, res) => {
  const service = await Service.findById(req.params.id);
  res.json(service);
});

// تعديل خدمة
router.put("/:id", async (req, res) => {
  const { name, price } = req.body;
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { name, price },
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({ message: "الخدمة غير موجودة" });
    }
    res.json({ message: "تم تعديل الخدمة", service: updatedService });
  } catch (err) {
    res.status(500).json({ message: "فشل في تعديل الخدمة" });
  }
});

router.delete('/api/services/:id', async (req, res) => {
  try {
    const serviceId = parseInt(req.params.id, 10);

    if (isNaN(serviceId)) {
      return res.status(400).json({ message: 'معرّف الخدمة غير صالح.' });
    }

    const deletedService = await Service.findOneAndDelete({ service_id: service_id });

    if (!deletedService) {
      return res.status(404).json({ message: 'الخدمة غير موجودة.' });
    }

    res.status(200).json({ message: 'تم حذف الخدمة بنجاح.' });
  } catch (error) {
    console.error('خطأ في حذف الخدمة:', error);
    res.status(500).json({ message: 'فشل في حذف الخدمة.', error: error.message });
  }
});


module.exports = router;