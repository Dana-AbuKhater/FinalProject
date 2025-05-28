//SalonRouts
// routes/salon.js
const express = require('express');
const router = express.Router();
const Salon = require('../models/Salon');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const requireAuth = require('../middleware/requireAuth');

// تهيئة multer لرفع الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
// router.post('/register', (req, res) => {
//   res.send('تم استلام الطلب!');
// });
router.post('/register', upload.single('logo'), async (req, res) => {
  try {
    const newSalon = new Salon(req.body);
    await newSalon.save();
    res.status(201).json({ success: true, data: newSalon });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
router.get('/test', (req, res) => {
  res.json({ success: true, message: "Salon routes working!" });
});

// مسار تسجيل الصالون
router.post('/register', upload.single('logo'), async (req, res) => {
  try {
    const {
      salon_id,
      owner_email,
      name,
      password,
      description,
      address,
      phone,
      workingHours,
      website
    } = req.body;

    // التحقق من البريد الإلكتروني الفريد
    const existingSalon = await Salon.findOne({ $or: [{ owner_email }, { salon_id }] });
    if (existingSalon) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني أو معرف الصالون موجود مسبقاً'
      });
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12);

    // إنشاء صالون جديد
    const newSalon = new Salon({
      salon_id,
      owner_email,
      name,
      password: hashedPassword,
      type: 'salon',
      description,
      address,
      phone,
      logo_url: req.file ? req.file.path : null,
      workingHours,
      website
    });

    await newSalon.save();

    // إنشاء توكن
    const token = jwt.sign(
      { id: newSalon._id, type: 'salon', owner_email: newSalon.owner_email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      success: true,
      message: 'تم تسجيل الصالون بنجاح',
      token,
      salon: {
        id: newSalon._id,
        name: newSalon.name,
        email: newSalon.owner_email
      }
    });

  } catch (error) {
    console.error('خطأ في تسجيل الصالون:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تسجيل الصالون',
      error: error.message
    });
  }
});

// جلب بيانات الصالون الحالي (حسب التوكن)
router.get('/info', requireAuth('salon'), async (req, res) => {
  try {

    const salon = await Salon.findOne({ owner_email: req.user.owner_email });
    if (!salon) return res.status(404).json({ error: 'Salon not found' });

    res.json(salon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = (upload) => {
  const router = require('express').Router();
  const requireAuth = require('../middleware/requireAuth');

  // Configure routes that need file uploads
  router.post('/upload', upload.single('image'), async (req, res) => {
    // Handle file upload
    try {
      const updateData = {
        ...req.body,
        ...(req.file && { imageUrl: `/uploads/${req.file.filename}` })
      };

      // Update salon in database
      const updatedSalon = await Salon.findByIdAndUpdate(
        req.user.salonId, // Assuming you have the salon ID in req.user
        updateData,
        { new: true }
      );

      res.json({ success: true, salon: updatedSalon });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }

  });

  // Other routes...
  router.get('/info', requireAuth('salon'), (req, res) => { /*...*/ });

  return router;
};
// تعديل بيانات الصالون (حسب التوكن)
router.put('/info', requireAuth('salon'), async (req, res) => {
  try {
    const salon = await Salon.findOneAndUpdate(
      { owner_email: req.user.email },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!salon) return res.status(404).json({ error: 'Salon not found' });

    res.json(salon);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error',
      details: err.message
    });
  }
});
router.get("/getsalons", async (req, res) => {
  //GET ALL SALONS
  try {
    const salons = await Salon.find();
    res.status(200).json({
      success: true,
      salons,
    });
  } catch (error) {
    console.error("Error fetching salons:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ✅ تعديل بيانات الصالون عن طريق salon_id من query
router.put('/update-salon/:salon_id', async (req, res) => {
  try {
    const { salon_id } = req.params;

    const updateData = req.query; // 👈 البيانات من query

    const updatedSalon = await Salon.findOneAndUpdate(
      { salon_id: salon_id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedSalon) return res.status(404).json({ error: 'Salon not found' });

    res.status(200).json({
      message: 'Salon info updated successfully',
      data: updatedSalon,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
