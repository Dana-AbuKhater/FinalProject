const User = require('../models/userModel'); // استيراد موديل المستخدم
const jwt = require('jsonwebtoken'); // استيراد مكتبة لإنشاء التوكين (JWT)
const bcrypt = require('bcrypt'); // استيراد مكتبة bcrypt لتشفير كلمات المرور

// إنشاء التوكين (Token)
const createToken = (_id) => {
  // التوكين يحتوي على معرّف المستخدم (ID) ويكون صالحًا لمدة 3 أيام
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
}

// تسجيل الدخول (Login)
const loginUser = async (req, res) => {
  const { email, password } = req.body; // استخراج البريد الإلكتروني وكلمة المرور من الجسم

  try {
    const user = await User.findOne({ email }); // البحث عن المستخدم في قاعدة البيانات باستخدام البريد الإلكتروني

    if (user) {
      // إذا تم العثور على المستخدم، نقارن كلمة المرور المدخلة بكلمة المرور المخزنة باستخدام bcrypt
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ error: 'Invalid password' }); // إذا كانت كلمة المرور غير صحيحة
      }

      // إنشاء التوكين بعد التحقق من صحة كلمة المرور
      const token = createToken(user._id);

      // إذا كان المستخدم من نوع صالون → رجّع بيانات الصالون أيضًا
      if (user.userType === "salon") {
        return res.status(200).json({
          email,
          token,
          userType: user.userType,
          salonInfo: {
            address: user.salonInfo?.address, // يرجع العنوان (ممكن يكون undefined)
            workingHours: user.salonInfo?.workingHours // يرجع ساعات العمل
          }
        });
      }

      // إذا كان المستخدم من نوع كستمر → رجّع نفس الرد القديم
      res.status(200).json({ email, token, userType: user.userType });

    } else {
      // إذا لم يتم العثور على المستخدم
      res.status(400).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    // إذا حدث خطأ أثناء العملية
    res.status(400).json({ error: error.message });
  }
}


// التسجيل (Signup)
const signupUser = async (req, res) => {
  const { email, password, userType, salonInfo, customerInfo } = req.body; // استخراج البيانات من الجسم

  try {
    // التحقق من وجود المستخدم في قاعدة البيانات باستخدام البريد الإلكتروني
    const exists = await User.findOne({ email });
    if (exists) {
      throw Error('Email already in use'); // إذا كان البريد الإلكتروني مسجلًا مسبقًا
    }

    // التحقق من صحة نوع المستخدم (صالون أو كستمر)
    if (!['salon', 'customer'].includes(userType)) {
      throw Error('Invalid user type'); // إذا كان النوع غير صالح
    }

    // تشفير كلمة المرور باستخدام bcrypt
    const salt = await bcrypt.genSalt(10); // توليد "salt" للتشفير
    const hash = await bcrypt.hash(password, salt); // تشفير كلمة المرور

    // إذا كان المستخدم من نوع صالون
    if (userType === 'salon') {
      // إنشاء مستخدم جديد في قاعدة البيانات مع بيانات الصالون
      const user = await User.create({ email, password: hash, userType, salonInfo });
      const token = createToken(user._id); // إنشاء التوكين

      // إرسال الاستجابة مع التوكين ونوع المستخدم
      res.status(200).json({ email, token, userType ,});
    } 
    // إذا كان المستخدم من نوع كستمر
    else if (userType === 'customer') {
      // إنشاء مستخدم جديد في قاعدة البيانات مع بيانات الكستمر
      const user = await User.create({ email, password: hash, userType, customerInfo });
      const token = createToken(user._id); // إنشاء التوكين

      // إرسال الاستجابة مع التوكين ونوع المستخدم
      res.status(200).json({ email, token, userType });
    }

  } catch (error) {
    // إذا حدث خطأ أثناء العملية
    res.status(400).json({ error: error.message });
  }
}

module.exports = { signupUser, loginUser };
