const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body,query, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  user_id: { type: Number, required: true},
  type: { type: String, required: true, enum: ['customer', 'vendor', 'admin'] },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// 📝 Register
router.post('/register',
  async (req, res) => {
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

      const hashedPassword = await bcrypt.hash(password, 12);
      // Get the user with the highest user_id
      const lastUser = await User.findOne().sort({ user_id: -1 });
      
      // Calculate the new user_id
      const user_id = lastUser ? lastUser.user_id + 1 : 1;
      const newUser = new User({
        user_id,
        userType:type,
        email,
        name:username,
        phone,
        password: hashedPassword
      });

      await newUser.save();

      res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        user: {
          id: newUser._id,
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
);

module.exports = router;