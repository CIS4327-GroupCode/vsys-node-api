// routes/auth.js
const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Auth route is working');
});
router.post(
  '/register',
  [
    body('username').trim().notEmpty().withMessage('Username should not be empty'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    // Add other validations for first_name, last_name, etc.
  ],
  register
);

router.post('/login', [body('username').trim().notEmpty(), body('password').notEmpty()], login);

module.exports = router;