const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Salon = require('../models/Salon');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.put('/api/salons/:id', upload.single('image'), async (req, res) => {
  try {
    const salonId = req.params.id;
    const updateData = {
      ...req.body,
      imagePath: req.file ? req.file.path : null
    };

    // Update salon in database
    const updatedSalon = await Salon.findByIdAndUpdate(salonId, updateData, { new: true });

    res.json({ success: true, salon: updatedSalon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
const requireAuth = (userTypeRequired) => {
  return async (req, res, next) => {
    // verify user is authenticated
    const { authorization } = req.headers;
    console.log("Authorization ===== :", authorization);
    if (!authorization) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1];

    try {
      const { id, type, email } = jwt.verify(token, process.env.JWT_SECRET); // جلب نوع المستخدم من التوكين
      console.log("ID : ", id);
      console.log("Type : ", type);
      console.log("Email : ", email);
      // التأكد من أن نوع المستخدم يتطابق مع المطلوب
      if (type !== userTypeRequired) {
        return res.status(403).json({ error: 'Access denied: User type mismatch' });
      }
      // جلب بيانات المستخدم حسب نوعه
      let user;
      if (type === 'customer') {
        user = await Customer.findOne({ _id: id }).select('_id userType email');
      } else if (type === 'salon') {
        user = await Salon.findOne({ _id: id }).select('_id owner_email serviceType');
      }

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      // إضافة المستخدم إلى request
      req.user = user;
      /* أنت هنا عم تستخدم User(المعرف كـ Customer) دايمًا لإضافة المستخدم للـ req.user، مع أنه ممكن المستخدم يكون صالون أو زبون(customer أو salon)
 لكن قبلها عندك جلب المستخدم الصحيح بناءً على نوعه في المتغير user:
       */
      next();

    } catch (error) {
      console.log(error);
      res.status(401).json({ error: 'Request is not authorized' });
    }
  };
};

module.exports = requireAuth;


