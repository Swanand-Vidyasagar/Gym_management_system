const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { authenticate, isAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// All staff routes require admin privileges
router.use(isAdmin);

// Get all staff
router.get('/', 
  staffController.getAllStaff
);

// Get staff by ID
router.get('/:id', 
  staffController.getStaffById
);

// Create staff
router.post('/', 
  staffController.validateStaff,
  staffController.createStaff
);

// Update staff
router.put('/:id', 
  staffController.updateStaff
);

// Delete staff
router.delete('/:id', 
  staffController.deleteStaff
);

module.exports = router;

