const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.post('/register', 
  authController.validateRegister,
  authController.register
);

router.post('/login', 
  authController.validateLogin,
  authController.login
);

// Protected route
router.get('/me', 
  authenticate,
  authController.getMe
);

module.exports = router;

