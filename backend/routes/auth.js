const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Password validation regex: >=8 chars, at least 1 number, at least 1 special character
const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  // 1. Validate Email format
  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address format.' });
  }

  // 2. Validate Password policy
  if (!password || !PASSWORD_REGEX.test(password)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password does not meet requirements (min 8 characters, 1 number, 1 special character).' 
    });
  }

  // 3. User verification and JWT generation
  // (Proceed to check against database)
  res.status(200).json({
    success: true,
    token: 'jwt_secure_token_' + Date.now(),
    user: {
      name: email.split('@')[0],
      email: email,
      role: role || 'Admin',
      store: 'Store Chennai-01'
    }
  });
});

module.exports = router;
