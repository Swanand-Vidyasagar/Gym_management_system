const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate, isAdmin } = require('../middleware/auth');

// All routes require authentication and admin privileges
router.use(authenticate);
router.use(isAdmin);

// Get dashboard statistics
router.get('/stats', 
  dashboardController.getDashboardStats
);

// Get revenue analytics
router.get('/revenue', 
  dashboardController.getRevenueAnalytics
);

module.exports = router;

