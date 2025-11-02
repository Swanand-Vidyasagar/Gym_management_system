const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, isAdmin, isStaffOrAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all payments
router.get('/', 
  paymentController.getAllPayments
);

// Get payment history for a user
router.get('/user/:userId', 
  paymentController.getUserPayments
);

// Get payment by ID
router.get('/:id', 
  paymentController.getPaymentById
);

// Create payment (Staff or Admin only)
router.post('/', 
  isStaffOrAdmin,
  paymentController.validatePayment,
  paymentController.createPayment
);

// Delete payment (Admin only)
router.delete('/:id', 
  isAdmin,
  paymentController.deletePayment
);

module.exports = router;

