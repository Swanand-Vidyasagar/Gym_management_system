const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all users (Admin only)
router.get('/', 
  isAdmin,
  userController.getAllUsers
);

// Get user by ID
router.get('/:id', 
  userController.getUserById
);

// Update user
router.put('/:id', 
  userController.validateUpdate,
  userController.updateUser
);

// Delete user (Admin only)
router.delete('/:id', 
  isAdmin,
  userController.deleteUser
);

module.exports = router;

