const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const userRoutes = require('./users');
const membershipRoutes = require('./memberships');
const paymentRoutes = require('./payments');
const staffRoutes = require('./staff');
const dashboardRoutes = require('./dashboard');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/memberships', membershipRoutes);
router.use('/payments', paymentRoutes);
router.use('/staff', staffRoutes);
router.use('/dashboard', dashboardRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Gym Management API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

