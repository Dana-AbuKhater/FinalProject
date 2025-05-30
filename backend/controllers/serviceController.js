const Service = require('../models/Service');
const Salon = require('../models/Salon');
const jwt = require('jsonwebtoken');

const updateServiceStatus = async (req, res) => {
    try {
        const serviceId = parseInt(req.params.id, 10); // لاحظ هون: req.params.id
        if (isNaN(serviceId)) {
            return res.status(400).json({ message: 'معرف الخدمة غير صالح.' });
        }

        const { status } = req.body;
        const validStatuses = ['visible', 'hidden', 'deleted'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ message: 'قيمة الحالة غير صالحة.' });
        }

        const updatedService = await Service.findOneAndUpdate(
            { service_id: serviceId },
            { $set: { status } },
            { new: true, runValidators: true }
        );

        if (!updatedService) {
            return res.status(404).json({ message: 'الخدمة غير موجودة.' });
        }

        res.status(200).json({ message: 'تم تحديث الحالة!', service: updatedService });
    } catch (error) {
        console.error('خطأ في تحديث حالة الخدمة:', error);
        res.status(500).json({ message: 'خطأ في الخادم', error: error.message });
    }
};



// إضافة خدمة جديدة
const addService = async (req, res) => {
    try {
        // استخراج التوكن
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Authorization token required' });

        // فك التوكن
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // جلب الصالون من قاعدة البيانات باستخدام id
        const salon = await Salon.findById(decoded.id);
        if (!salon) return res.status(404).json({ message: 'Salon not found' });

        const salon_id = salon.salon_id;

        // جلب البيانات من البودي
        const { name, price, discount, duration, description, category, status } = req.body;

        // تحويل البيانات
        const parsedPrice = parseFloat(price);
        const parsedDiscount = parseFloat(discount);
        const parsedDuration = parseInt(duration, 10);

        if (!name || isNaN(parsedPrice)) {
            return res.status(400).json({ message: 'اسم الخدمة والسعر مطلوبان' });
        }

        // حساب service_id
        const lastService = await Service.findOne().sort({ service_id: -1 });
        const service_id = lastService ? lastService.service_id + 1 : 1;

        // إنشاء خدمة جديدة
        const newService = new Service({
            service_id,
            salon_id,
            name,
            price: parsedPrice,
            duration_minutes: parsedDuration,
            description,
            category,
            is_discounted: parsedDiscount > 0,
            discount_price: parsedDiscount > 0 ? parsedDiscount : undefined,
            status
        });

        await newService.save();
        res.status(201).json({ message: 'تمت إضافة الخدمة بنجاح!', service: newService });

    } catch (error) {
        console.error('خطأ في إضافة الخدمة:', error);
        res.status(500).json({ message: 'فشل في إضافة الخدمة', error: error.message });
    }
};
  
module.exports = {
    updateServiceStatus, addService
};
