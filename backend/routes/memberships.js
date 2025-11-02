const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const { authenticate, isAdmin, isStaffOrAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all memberships
router.get('/', 
  membershipController.getAllMemberships
);

// Get membership by ID
router.get('/:id', 
  membershipController.getMembershipById
);

// Create membership (Staff or Admin only)
router.post('/', 
  isStaffOrAdmin,
  membershipController.validateMembership,
  membershipController.createMembership
);

// Update membership (Staff or Admin only)
router.put('/:id', 
  isStaffOrAdmin,
  membershipController.updateMembership
);

// Delete membership (Admin only)
router.delete('/:id', 
  isAdmin,
  membershipController.deleteMembership
);

module.exports = router;

