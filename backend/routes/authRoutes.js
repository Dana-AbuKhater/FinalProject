const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, query, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const crypto = require("crypto"); // مطلوب لإنشاء الأرقام العشوائية


// User Schema
const userSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true }, // تغيير التأكد إلى unique
  type: { type: String, required: true, enum: ["customer", "vendor", "admin"] },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  phone: { type: Number, required: true, maxlength: 10 }, // تم تغييره إلى Number ليتوافق مع INT
  password: { type: String, required: true, minlength: 6, select: false }, // تم إضافة minlength: 6 بناءً على NN
  createdAt: { type: Date, default: Date.now },
});

// Salon Schema
const salonSchema = new mongoose.Schema({
  salon_id: { type: Number, required: true, unique: true }, // تم تغييره إلى Number وإضافة unique: true بناءً على المفتاح الأساسي INT
  owner_email: { type: String, required: true, maxlength: 100, unique: true },
  name: { type: String, required: true, maxlength: 100 },
  password: { type: String, required: true, minlength: 6, select: false }, // تم إضافة minlength: 6 بناءً على NN
  type: { type: String, required: true, enum: ["salon"] }, // تم إضافة enum بناء
  description: { type: String }, // تم تغييره إلى String ليتوافق مع TEXT (يمكن أن يكون نصًا طويلاً)
  address: { type: String }, // تم إضافة required: true بناءً على NN
  phone: { type: String, maxlength: 10, required: true }, // تم تغييره إلى String ليتوافق مع VARCHAR
  logo_url: { type: String, maxlength: 255 },
  created_at: { type: Date, default: Date.now }, // تم تغييره ليتوافق مع TIMESTAMP
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Salon = mongoose.models.Salon || mongoose.model("Salon", salonSchema);
// 📝 Register
router.post("/register", async (req, res) => {
  async function generateUniqueId(model) {
    let id;
    let isUnique = false;

    while (!isUnique) {
      id = crypto.randomInt(100000, 999999); // رقم عشوائي من 6 أرقام
      const exists = await model.findOne({
        [model === User ? "user_id" : "salon_id"]: id,
      });
      if (!exists) isUnique = true;
    }

    return id;
  }

  if (req.query.type == "customer") {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => err.msg),
      });
    }

    const { type, email, username, phone, password } = req.query;

    try {
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email or username already exists",
        });
      }
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user_id = await generateUniqueId(User);

      const newUser = new User({
        user_id,
        type,
        email,
        name: username,
        phone,
        password: hashedPassword,
      });

      await newUser.save();

      // **هنا تولد التوكن بعد إنشاء المستخدم**
      const token = jwt.sign(
        { id: newUser._id, type: newUser.type },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(201).json({
        success: true,
        message: "Account created successfully!",
        token, // ضروري يكون هون
        user: {
          id: newUser._id,
          user_id: newUser.user_id,
          type: newUser.type,
          email: newUser.email,
          username: newUser.name, //انت استخدمت name في الـ Schema
          phone: newUser.phone,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);

      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Email or username already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  } else if (req.query.type == "salon") {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => err.msg),
      });
    }

    const { type, email, username, phone, password } = req.query;

    try {
      const existingSalon = await Salon.findOne({
        $or: [{ email }, { name: username }],
      });
      if (existingSalon) {
        return res.status(400).json({
          success: false,
          message: "Salon with this name or email already exists",
        });
      }

      const salon_id = await generateUniqueId(Salon);
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const newSalon = new Salon({
        salon_id,
        owner_email: email,
        name: username,
        password: hashedPassword,
        type,
        phone,
      });
      await newSalon.save();
      const salonToken = jwt.sign(
        { id: newSalon._id, type: newSalon.type },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(201).json({
        success: true,
        message: "Salon created successfully!",
        token: salonToken,
        salon: {
          id: newSalon._id,
          salon_id: newSalon.salon_id,
          name: newSalon.name,
          owner_id: newSalon.owner_id,
          email: newSalon.email,
          phone: newSalon.phone,
        },
      });
    } catch (error) {
      console.error("Salon creation error:", error);

      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Salon with this name or email already exists",
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
});

router.post("/login", async (req, res) => {
  const { type, email, password } = req.query;

  try {
    let user;
    if (type === "customer") {
      user = await User.findOne({ email }).select("+password"); // تأكد من تضمين كلمة المرور في الاستعلام
    } else if (type === "salon") {
      // check the email and password in the salon schema
      user = await Salon.findOne({ owner_email: email }).select("+password"); // تأكد من تضمين كلمة المرور في الاستعلام
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid user type",
      });
    }
    console.log("Type : ", type);
    console.log("User : ", user);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const { password: _, ...userData } = user._doc;

    const token = jwt.sign(
      { id: user._id, type: type }, // البيانات التي تريد تشفيرها في التوكن
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("token=", token);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token, // إرسال التوكن مع الرد
      user: userData, // بيانات المستخدم بدون كلمة المرور
    });
    /*const { password: _, ...userData } = user._doc; // استبعاد كلمة المرور من البيانات المرسلة
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userData
    });*/
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
/*
const salonToken = jwt.sign(
  { id: newSalon._id, type: newSalon.type },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

res.status(201).json({
  success: true,
  message: "Salon created successfully!",
  token: salonToken,
  salon: {
    id: newSalon._id,
    salon_id: newSalon.salon_id,
    name: newSalon.name,
    email: newSalon.owner_email,
    phone: newSalon.phone,
  },
});
*/


module.exports = router;
