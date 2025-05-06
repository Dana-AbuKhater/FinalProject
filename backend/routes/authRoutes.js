const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const crypto = require('crypto'); // مطلوب لإنشاء الأرقام العشوائية
// User Schema
const userSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true }, // تغيير التأكد إلى unique
  type: { type: String, required: true, enum: ['customer', 'vendor', 'admin'] },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  phone: { type: Number, required: true },
  password: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// 📝 Register
router.post('/register',
  async (req, res) =>{ 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg)
      });
    }

    const { type, email, username, phone, password } = req.query;


    try {
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email or username already exists'
        });
      }
      const user_id = await generateUniqueId(User);
      const hashedPassword = await bcrypt.hash(password, 12);
      // Get the user with the highest user_id
      //const lastUser = await User.findOne().sort({ user_id: -1 });
      
      // Calculate the new user_id
      //const user_id = lastUser ? lastUser.user_id + 1 : 1;
      async function generateUniqueId(model) {
        let id;
        let isUnique = false;
        
        while (!isUnique) {
          id = crypto.randomInt(100000, 999999); // رقم عشوائي من 6 أرقام
          const exists = await model.findOne({ [model === User ? 'user_id' : 'salon_id']: id });
          if (!exists) isUnique = true;
        }
        
        return id;
      }
      const newUser = new User({
        user_id,
        userType: type,
        email,
        name: username,
        phone,
        password: hashedPassword
      });

      await newUser.save();

      res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        user: {
          id: newUser._id,
          user_id: newUser.user_id,
          type: newUser.type,
          email: newUser.email,
          username: newUser.username,
          phone: newUser.phone
        }
      });

    } catch (error) {
      console.error('Registration error:', error);

      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Email or username already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
); // Close the '/register' route properly

// 🏢 Salon Creation
router.post('/salons', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => err.msg)
    });
  }
  const {type, email, username, phone, password } = req.query;
  try {
    const existingSalon = await Salon.findOne({ $or: [{ name }, { email }] });
    if (existingSalon) {
      return res.status(400).json({
        success: false,
        message: 'Salon with this name or email already exists'
      });
    }
    const salon_id = await generateUniqueId(Salon);

    const newSalon = new Salon({
      salon_id,
      name,
      phone,
      email,
    });
    await newSalon.save();

    res.status(201).json({
      success: true,
      message: 'Salon created successfully!',
      salon: {
        id: newSalon._id,
        salon_id: newSalon.salon_id,
        name: newSalon.name,
        owner_id: newSalon.owner_id,
        email: newSalon.email,
        phone: newSalon.phone
      }
    });

  } catch (error) {
    console.error('Salon creation error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Salon with this name or email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// 🏢 Get All Salons
router.get('/salons', async (req, res) => {
  try {
    const salons = await Salon.find().select('-__v');
    res.json({
      success: true,
      count: salons.length,
      data: salons
    });
  } catch (error) {
    console.error('Error fetching salons:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// 🏢 Get Single Salon
router.get('/salons/:id', async (req, res) => {
  try {
    const salon = await Salon.findOne({ salon_id: req.params.id }).select('-__v');
    
    if (!salon) {
      return res.status(404).json({
        success: false,
        message: 'Salon not found'
      });
    }

    res.json({
      success: true,
      data: salon
    });
  } catch (error) {
    console.error('Error fetching salon:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
module.exports = router;