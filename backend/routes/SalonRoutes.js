// routes/salon.js
const express = require('express');
const router = express.Router();
const Salon = require('../models/Salon');
const requireAuth = require('../middleware/requireAuth');
// جلب بيانات الصالون الحالي (حسب التوكن)
router.get('/info', requireAuth('salon'), async (req, res) => {
  try {
    const salon = await Salon.findOne({ owner_email: req.user.email });
    if (!salon) return res.status(404).json({ error: 'Salon not found' });

    res.json(salon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// تعديل بيانات الصالون (حسب التوكن)
router.put('/info', requireAuth('salon'), async (req, res) => {
  try {
    const salon = await Salon.findOneAndUpdate(
      { owner_email: req.user.email },
      { $set: req.body },
      { new: true , runValidators: true }
    );
    if (!salon) return res.status(404).json({ error: 'Salon not found' });

    res.json(salon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' ,
      details: err.message});
  }
});

module.exports = router;
