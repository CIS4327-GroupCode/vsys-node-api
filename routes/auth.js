// routes/auth.js
const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.post(
  '/register',
  [
    body('username').not().isEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    // Add other validations for first_name, last_name, etc.
  ],
  register
);

router.post('/login', [body('username').not().isEmpty(), body('password').not().isEmpty()], login);

module.exports = router;