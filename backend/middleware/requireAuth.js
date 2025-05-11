// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = (userTypeRequired) => {
  return async (req, res, next) => {
    // verify user is authenticated
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1];

    try {
      const { _id, userType } = jwt.verify(token, process.env.SECRET); // جلب نوع المستخدم من التوكين

      // التأكد من أن نوع المستخدم يتطابق مع المطلوب
      if (userType !== userTypeRequired) {
        return res.status(403).json({ error: 'Access denied: User type mismatch' });
      }

      // إضافة المستخدم إلى request
      req.user = await User.findOne({ _id }).select('_id userType');
      next();

    } catch (error) {
      console.log(error);
      res.status(401).json({ error: 'Request is not authorized' });
    }
  };
};

module.exports = requireAuth;
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

