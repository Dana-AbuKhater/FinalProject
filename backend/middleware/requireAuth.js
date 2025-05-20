const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Salon = require('../models/Salon');

const requireAuth = (userTypeRequired) => {
  return async (req, res, next) => {
    // verify user is authenticated
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1];

    try {
      const { _id, userType, email } = jwt.verify(token, process.env.SECRET); // جلب نوع المستخدم من التوكين

      // التأكد من أن نوع المستخدم يتطابق مع المطلوب
      if (userType !== userTypeRequired) {
        return res.status(403).json({ error: 'Access denied: User type mismatch' });
      }
      // جلب بيانات المستخدم حسب نوعه
      let user;
      if (userType === 'customer') {
        user = await Customer.findOne({ _id }).select('_id userType email');
      } else if (userType === 'salon') {
        user = await Salon.findOne({ owner_email: email }).select('_id owner_email serviceType');
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


