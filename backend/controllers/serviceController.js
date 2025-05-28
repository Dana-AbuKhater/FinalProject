const Service = require('../models/Service');

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

module.exports = {
    updateServiceStatus,
};
