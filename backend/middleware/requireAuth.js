// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = (userTypeRequired) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authorization.split(' ')[1];

    try {
      const { _id, email, userType } = jwt.verify(token, process.env.SECRET);

      if (userType !== userTypeRequired) {
        return res.status(403).json({ error: 'Access denied: User type mismatch' });
      }

      req.user = { _id, email }; // إضافة البريد الإلكتروني للمستخدم
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ error: 'Request is not authorized' });
    }
  };
};

module.exports = requireAuth;
