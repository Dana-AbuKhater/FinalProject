const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const cors = require('cors');

// Middleware for handling JSON requests and CORS
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cors());

// User Schema
const userSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  type: { type: String, required: true, enum: ['customer', 'salon', 'admin'] },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Salon Schema
const salonSchema = new mongoose.Schema({
  salon_id: { type: Number, required: true, unique: true },
  owner_email: { type: String, required: true, maxlength: 100 },
  name: { type: String, required: true, maxlength: 100, unique: true },
  description: { type: String },
  address: { type: String, required: true },
  phone: { type: String, maxlength: 20 },
  logo_url: { type: String, maxlength: 255 },
  createdAt: { type: Date, default: Date.now }
});

const Salon = mongoose.models.Salon || mongoose.model('Salon', salonSchema);

// Registration route - explicitly handling query parameters
router.post('/register', async (req, res) => {
  try {
    // Explicitly use query parameters since that's what your client is sending
    const { type, email, username, phone, password } = req.query;

    // Debug log to see what data is being received
    console.log("Registration data received from query:", req.query);
    
    // Validate required fields
    if (!type || !email || !username || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
        missingFields: {
          type: !type,
          email: !email,
          username: !username,
          phone: !phone,
          password: !password
        }
      });
    }

    // Validate user type
    if (!['customer', 'salon', 'admin'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }

    // Check for existing users based on type
    if (type === 'customer') {
      const existingUser = await User.findOne({ $or: [{ email }, { name: username }] });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email or username already exists'
        });
      }
    } else if (type === 'salon') {
      const existingUser = await User.findOne({ $or: [{ email }, { name: username }] });
      const existingSalon = await Salon.findOne({ $or: [{ owner_email: email }, { name: username }] });
      
      if (existingUser || existingSalon) {
        return res.status(400).json({
          success: false,
          message: 'Email or username already exists'
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Get new user_id
    const lastUser = await User.findOne().sort({ user_id: -1 });
    const user_id = lastUser ? lastUser.user_id + 1 : 1;
    
    // Create new user
    const newUser = new User({
      user_id,
      type,
      email,
      name: username,
      phone,
      password: hashedPassword
    });

    // Save user to database
    await newUser.save();
    
    // Create salon record if user type is salon
    if (type === 'salon') {
      const lastSalon = await Salon.findOne().sort({ salon_id: -1 });
      const salon_id = lastSalon ? lastSalon.salon_id + 1 : 1;
      
      const newSalon = new Salon({
        salon_id,
        owner_email: email,
        name: username,
        address: 'Default Address',
        phone,
        description: ''
      });
      
      await newSalon.save();
    }

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: newUser._id,
        type: newUser.type,
        email: newUser.email,
        username: newUser.name,
        phone: newUser.phone
      }
    });
  } catch (error) {
    console.error('Registration error details:', error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email or username already exists'
      });
    }

    // Handle general errors
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;