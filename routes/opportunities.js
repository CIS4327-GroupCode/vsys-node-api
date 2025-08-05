// routes/opportunities.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeAdmin = require('../middleware/authorize');
const opportunityController = require('../controllers/opportunityController');

// Public route to get all opportunities
router.get('/', opportunityController.getAllOpportunities);
// Public route to get a single opportunity
router.get('/:id', opportunityController.getOpportunityById);

// Admin-only routes
router.post('/', auth, authorizeAdmin, opportunityController.createOpportunity);
router.put('/:id', auth, authorizeAdmin, opportunityController.updateOpportunity);
router.delete('/:id', auth, authorizeAdmin, opportunityController.deleteOpportunity);

module.exports = router;
