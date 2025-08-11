const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAdmin = require('../middleware/authorize');
const opportunityController = require('../controllers/opportunityController');

// Public routes: all opportunities | specific opportunity
router.get('/', opportunityController.getAllOpportunities);
router.get('/:id', opportunityController.getOpportunityById);

// Admin-only routes: create | update | delete opportunity
router.post('/', auth, authorizeAdmin, opportunityController.createOpportunity);
router.put('/:id', auth, authorizeAdmin, opportunityController.updateOpportunity);
router.delete('/:id', auth, authorizeAdmin, opportunityController.deleteOpportunity);

module.exports = router;
