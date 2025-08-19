const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAdmin = require('../middleware/authorize');
const addressController = require('../controllers/addressController');

// Public routes: all centers | specific center
router.get('/', addressController.getAllAddresses);
router.get('/:id', addressController.getAddressById);
router.post('/', addressController.createAddress);

// Admin-only routes: delete address
router.delete('/:id', auth, authorizeAdmin, addressController.deleteAddress);

module.exports = router;