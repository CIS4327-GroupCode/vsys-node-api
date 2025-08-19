// routes/auth.js
const express = require('express');
//const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Auth route is working');
});
router.post('/register', register);

router.post('/login', login);

module.exports = router;