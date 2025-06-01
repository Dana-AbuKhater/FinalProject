//SalonRouts
// routes/salon.js
const express = require('express');
const router = express.Router();
const Salon = require('../models/Salon');
const Service = require('../models/Service'); // استدعاء موديل الخدمة

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
/*
router.post('/register', upload.single('logo'), async (req, res) => {
  try {
    const newSalon = new Salon(req.body);
    await newSalon.save();
    res.status(201).json({ success: true, data: newSalon });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});*/
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
router.put('/info/:id', requireAuth('salon'), async (req, res) => {
  // console.log("Email from req.user:", req.user.email);
  try {
    const { id } = req.params;
    const updateData = req.body; // البيانات التي سيتم تحديثها
    console.log("Update Data:", updateData);
    console.log("ID from params:", id);

    // التحقق من وجود الصالون
    const salon = await Salon.findOneAndUpdate(
      { _id: id }, // التأكد من أن الصالون يعود لنفس المستخدم
      { $set: updateData },
      { new: true, runValidators: true }
    );
    // remove password from the response
    delete salon.password;
    res.status(200).json({ success: true, message: 'Salon updated successfully', salon });

    console.log("Updated Salon:", salon);
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
/*
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
});*/

router.get("/getsalons", async (req, res) => {
  try {
    const { location, minPrice, maxPrice, category } = req.query; // 'category' هنا هو فلتر الكاتيجوري من الـ URL

    // تحديد نوع الفلترة المطلوبة:
    const hasServiceFilters = (minPrice || maxPrice || (category && category !== "" && category.toLowerCase() !== "other"));
    const isLocationOnlyFilter = (location && !hasServiceFilters);
    const noFiltersApplied = (!location && !hasServiceFilters);

    if (noFiltersApplied || isLocationOnlyFilter) {
      // --- حالة: جلب الصالونات (فلترة موقع فقط أو لا شيء) ---
      let salonPipeline = [];

      if (location) {
        const searchLocation = location.trim();
        salonPipeline.push({
          $match: {
            $or: [
              { address: { $exists: true, $ne: "" } },
              { " address": { $exists: true, $ne: "" } }
            ]
          }
        });
        salonPipeline.push({
          $match: {
            $expr: {
              $or: [
                {
                  $regexMatch: {
                    input: { $trim: { input: "$address" } },
                    regex: searchLocation,
                    options: "i"
                  }
                },
                {
                  $regexMatch: {
                    input: { $trim: { input: "$ address" } },
                    regex: searchLocation,
                    options: "i"
                  }
                }
              ]
            }
          }
        });
      }

      if (salonPipeline.length === 0) {
        salonPipeline.push({ $match: {} });
      }

      console.log("Mode: Fetching Salons");
      console.log("Salon Pipeline:", JSON.stringify(salonPipeline, null, 2));

      const salons = await Salon.aggregate(salonPipeline);
      console.log("Number of salons found:", salons.length);
      return res.status(200).json({ success: true, salons });

    } else {
      // --- حالة: جلب الخدمات (فلترة سعر أو كاتيجوري أو موقع + سعر + كاتيجوري) ---
      let servicePipeline = [];

      // 1. فلترة الخدمات حسب السعر
      if (minPrice || maxPrice) {
        let priceMatchCondition = {};
        if (minPrice) {
          const parsedMinPrice = parseFloat(minPrice);
          if (!isNaN(parsedMinPrice) && parsedMinPrice >= 0) {
            priceMatchCondition.$gte = parsedMinPrice;
          }
        }
        if (maxPrice) {
          const parsedMaxPrice = parseFloat(maxPrice);
          if (!isNaN(parsedMaxPrice) && parsedMaxPrice >= 0) {
            priceMatchCondition.$lte = parsedMaxPrice;
          }
        }
        if (Object.keys(priceMatchCondition).length > 0) {
          servicePipeline.push({
            $match: {
              price: priceMatchCondition // الفلترة على حقل 'price' في Service Schema
            }
          });
        }
      }

      // 2. فلترة الخدمات حسب نوع الخدمة (باستخدام حقل 'category' في Service Schema)
      if (category && category !== "" && category.toLowerCase() !== "other") {
        servicePipeline.push({
          $match: {
            category: category.toLowerCase() // *** تغيير هنا: استخدام 'category' بدلاً من 'service_type' ***
          }
        });
      }

      // 3. ربط الخدمات بالصالونات لجلب تفاصيل الصالون والفلترة حسب موقعه
      // بما أن 'salon_id' هو Number في كلا الموديلين، نستخدمه للربط
      servicePipeline.push({
        $lookup: {
          from: 'salons', // اسم الكولكشن للصالونات في قاعدة البيانات
          localField: 'salon_id', // *** تغيير هنا: استخدام 'salon_id' في Service Schema ***
          foreignField: 'salon_id', // *** تغيير هنا: استخدام 'salon_id' في Salon Schema ***
          as: 'salonDetails' // الاسم الذي ستظهر فيه تفاصيل الصالون داخل كل مستند خدمة
        }
      });

      // 4. فك مصفوفة الصالونات (ضروري لأن $lookup يرجع مصفوفة حتى لو كان هناك عنصر واحد)
      servicePipeline.push({
        $unwind: '$salonDetails'
      });

      // 5. فلترة الخدمات بناءً على موقع الصالون (إذا تم تحديد موقع)
      if (location) {
        const searchLocation = location.trim();
        servicePipeline.push({
          $match: {
            $or: [
              { "salonDetails.address": { $exists: true, $ne: "" } },
              { "salonDetails. address": { $exists: true, $ne: "" } }
            ]
          }
        });
        servicePipeline.push({
          $match: {
            $expr: {
              $or: [
                {
                  $regexMatch: {
                    input: { $trim: { input: "$salonDetails.address" } },
                    regex: searchLocation,
                    options: "i"
                  }
                },
                {
                  $regexMatch: {
                    input: { $trim: { input: "$salonDetails. address" } },
                    regex: searchLocation,
                    options: "i"
                  }
                }
              ]
            }
          }
        });
      }

      if (servicePipeline.length === 0) {
        servicePipeline.push({ $match: {} });
      }

      console.log("Mode: Fetching Services");
      console.log("Service Pipeline:", JSON.stringify(servicePipeline, null, 2));

      const services = await Service.aggregate(servicePipeline);
      console.log("Number of services found:", services.length);
      return res.status(200).json({ success: true, services });
    }

  } catch (err) {
    console.error("Error in /getsalons:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
// ✅ تعديل بيانات الصالون عن طريق salon_id من query
router.put('/update-salon/:salon_id', async (req, res) => {
  try {
    const { salon_id } = req.params;
    console.log("Salon ID from params:", salon_id);
    const updateData = req.body; // 👈 البيانات من query
    console.log("Update Data222:", updateData);
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
/*
router.get("/getsalonslocation", async (req, res) => {
  try {
    const { location } = req.query;
    console.log("Location received:", location);

    let pipeline = [];

    if (location && location.trim()) {
      const searchLocation = location.trim();
      console.log("Trimmed search location:", searchLocation);

      // التأكد من وجود عنوان قبل الفلترة
      pipeline.push({
        $match: {
          $or: [
            { address: { $exists: true, $ne: "", $ne: null } },
            { " address": { $exists: true, $ne: "", $ne: null } }
          ]
        }
      });

      // فلترة بناءً على الموقع
      pipeline.push({
        $match: {
          $or: [
            {
              $expr: {
                $regexMatch: {
                  input: { $trim: { input: "$address" } },
                  regex: searchLocation,
                  options: "i"
                }
              }
            },
            {
              $expr: {
                $regexMatch: {
                  input: { $trim: { input: "$ address" } },
                  regex: searchLocation,
                  options: "i"
                }
              }
            }
          ]
        }
      });
    } else {
      // إذا مفيش location، ارجع كل الصالونات
      console.log("No location filter applied - returning all salons");
    }

    console.log("Aggregation Pipeline:", JSON.stringify(pipeline, null, 2));

    const salons = await Salon.aggregate(pipeline);
    console.log("Number of salons found:", salons.length);

    res.status(200).json({ success: true, salons });
  } catch (err) {
    console.error("Error in /getsalons:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
  console.log("Request URL:", req.originalUrl);
  console.log("Query params:", req.query);
  console.log("Route accessed at:", new Date().toISOString());
});*/


module.exports = router;
