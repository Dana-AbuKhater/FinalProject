const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const path = require('path'); // Add this line to import path
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const bodyParse = require("body-parser")
require('dotenv').config();

const router = express.Router();

const multer = require('multer');
const Service = require('./models/Salon');
const SalonRoutes= require('./routes/SalonRoutes');
const CustomerRoutes = require('./routes/CustomerRoutes');
const ServiceRoutes = require('./routes/ServiceRoutes');
//const AppointmentsRoutes = require('./routes/AppointmentsRoutes');
const RatingRoutes = require('./routes/RatingRoutes');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001', // السماح فقط لطلبات من الواجهة الأمامية
  credentials: true
}));
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ DB Connection Error", err));

const appointmentRoutes = require('./routes/AppointmentsRoutes');
app.use('/appointments', appointmentRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
// Serve static files from the frontend directory
//app.use(express.static('frontend'));

// API Routes
//app.use('/api/salons', SalonRoutes);
// app.use('/api/customers', CustomerRoutes);
app.use('/api/services', ServiceRoutes);
// app.use('/api/appointments', AppointmentsRoutes);
// app.use('/api/ratings', RatingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/salon', require('./routes/SalonRoutes'));

// Root route handler
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the API',
    documentation: 'Refer to API docs for available endpoints'
  });
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
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});
// Replace your model definition with:
const User = mongoose.models.User || mongoose.model('User', userSchema);
app.engine('JSON', require('ejs').renderFile)
let parseBody = bodyParser.urlencoded({ extended: true });
// Routes
app.post('/register1234', async (req, res) => {
  // Validation
  console.log("Req :", req)
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

  const { type, email, username, phone, password } = req.query;


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

    const jwt = require('jsonwebtoken');

    await newUser.save();
    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, type: newUser.type },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
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
        errors: 'Internal server error'
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
// Enhanced Multer config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const uploads = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
app.post("/uploads", uploads.single("inputuploads"), async (request, response) => {
  let token = request.headers.cookie;
  filePath = `uploads/${request.file.filename}`;
  if (token) {
    tokenIndex = token.indexOf("token=") + 1;
    token = token.substring((tokenIndex + 5),).split(";")[0];
    jwt.verify(token, 'jsfashlaekhe', function (err, decoded) {
      if (err) {
        // return /response.status(401).redirect("../login");
        return response.status(500).send(err)
      }
      connection.query("UPDATE `application` SET assignment=? where student_id = ?",
        [filePath, decoded.id], (err, data) => {
          if (err) {
            response.status(500).send(err);
          }
          response.status(200).redirect("../candidate-dashboard")
        })
    })

  }
  else {
    response.status(402).send("failed token")
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something broke!123' });
});

app.listen(3000, () => {
  console.log("🚀 Server is running on port 3000");
});

router.post('/create', async (req, res) => {
  try {
    console.log(req.body); // شوف شو واصل

    const newService = new Service(req.body);
    await newService.save();

    res.status(201).json({ success: true, message: "Service added!", data: newService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add service." });
  }
});
