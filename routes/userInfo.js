const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAdmin = require('../middleware/authorize');
const usersController = require('../controllers/usersController');

// Public routes: all users | specific user 
router.get('/', usersController.getAllUsers);
router.get('/:username', usersController.getUserByUsername);

// Admin-only routes: update | delete user
router.put('/:username', auth, authorizeAdmin, usersController.updateUser);
router.delete('/:username', auth, authorizeAdmin, usersController.deleteUser);

module.exports = router;