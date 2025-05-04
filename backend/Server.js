const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const path = require('path'); // Add this line to import path
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const SalonRoutes = require('./routes/SalonRoutes');
const CustomerRoutes = require('./routes/CustomerRoutes');
const ServiceRoutes = require('./routes/ServiceRoutes');
const AppointmentsRoutes = require('./routes/AppointmentsRoutes');
const RatingRoutes = require('./routes/RatingRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ DB Connection Error", err));

// Serve static files from the frontend directory
app.use(express.static('frontend'));

// API Routes
app.use('/api/salons', SalonRoutes);
app.use('/api/customers', CustomerRoutes);
app.use('/api/services', ServiceRoutes);
app.use('/api/appointments', AppointmentsRoutes);
app.use('/api/ratings', RatingRoutes);
//app.use('/api/auth', authRoutes);

// Root route handler
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
// User Schema
const userSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['customer', 'vendor', 'admin'] },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

// Replace your model definition with:
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Routes
app.post('/api/auth/register123', 
  [
    body('type').isIn(['customer', 'vendor', 'admin']).withMessage('Invalid user type'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
    body('username').isLength({ min: 3 }).trim().withMessage('Username must be at least 3 characters'),
    body('phone').isMobilePhone().withMessage('Invalid phone number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    // Validation
    console.log("Req :",req)
    // console.log("Res :",res.body)
    const errors = validationResult(req);
    /**console.log(req.body.password)**/
    if (!errors.isEmpty()) {  
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg)
      });
    }

    const { type, email, username, phone, password } = req.body;

  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'User with this email or username already exists' 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user
      const newUser = new User({
        type,
        email,
        username,
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
      
      // Handle specific MongoDB errors
      if (error.name === 'ValidationError') {

        const messages = Object.values(error.errors).map(val => val.message);
        const messages1 = "test"
        return res.status(400).json({ 
          success: false, 
          message: 'Validation error',
          errors:  'Internal server error'
        });
      }
      
      // Handle duplicate key error
      if (error.code === 11000) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email or username already exists' 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        message: messages1
      });
    }
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something broke!123' });
});

app.listen(3000, () => {
  console.log("🚀 Server is running on port 3000");
});