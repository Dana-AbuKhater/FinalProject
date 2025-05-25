// routes/salon.js
const express = require('express');
const router = express.Router();
const Salon = require('../models/Salon');
const requireAuth = require('../middleware/requireAuth');
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
