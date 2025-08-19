const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAdmin = require('../middleware/authorize');
const centerController = require('../controllers/centerController');

// Public routes: all centers | specific center
router.get('/', centerController.getAllCenters);
router.get('/:id', centerController.getCenterById);

// Admin-only routes: create | update(no auth required) | delete center
router.post('/', auth, authorizeAdmin, centerController.createCenter);
router.put('/:id', centerController.updateCenter);
router.delete('/:id', auth, authorizeAdmin, centerController.deleteCenter);

module.exports = router;