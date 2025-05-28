const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const path = require('path'); // Add this line to import path
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const bodyParse = require("body-parser")

require('dotenv').config();



const router = express.Router();

const requireAuth = require('./middleware/requireAuth'); // عدل المسار حسب مكان الملف الحقيقي

const multer = require('multer');

const SalonRoutes = require('./routes/SalonRoutes');
const CustomerRoutes = require('./routes/CustomerRoutes');
const ServiceRoutes = require('./routes/ServiceRoutes');
//const AppointmentsRoutes = require('./routes/AppointmentsRoutes');
const RatingRoutes = require('./routes/RatingRoutes');
const authRoutes = require('./routes/authRoutes');
//const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001', // السماح فقط لطلبات من الواجهة الأمامية
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ DB Connection Error", err));

const appointmentRoutes = require('./routes/AppointmentsRoutes');
app.use('/appointments', appointmentRoutes);

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
// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }

//   next();
// });
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
      message: error.message
    });
  }
}
);
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const uploads = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

app.post("/api/salon/upload", requireAuth('salon'), uploads.single("inputuploads"), async (req, res) => {

  // console.log("Token :", req.cookies.token)
  // console.log("Token2 :", req.cookies.token || req.headers.cookie?.split('token=')[1]?.split(';')[0])
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }




    const filePath = "uploads/" + req.file.filename;
    console.log("File Name :", req.file.filename);
    console.log("File Name :", req.file.filename);
    console.log("User :", req.user);
    // add the file path to the salon's document in the database
    const salon = await require('./models/Salon').findOneAndUpdate(
      { owner_email: req.user.owner_email },
      { $set: { logo_url: filePath } },
      { new: true }
    );
    if (!salon) {
      return res.status(404).send('Salon not found');
    }
    res.json({
      success: true,
      message: 'File uploaded successfully',
      filePath: filePath,
      salon: {
        id: salon._id,
        name: salon.name,
        owner_email: salon.owner_email,
        logo_url: salon.logo_url
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: res.locals.errorMessage || 'Internal Server Error' });
});

app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params
    .filename
  );
  console.log("File Path14 :", filePath);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('File not found:', err);
      res.status(404).send('File not found');
    } else {
      console.log('File sent:', req.params.filename);
    }
  });
});


app.listen(3000, () => {
  console.log("🚀 Server is running on port 3000");
});


