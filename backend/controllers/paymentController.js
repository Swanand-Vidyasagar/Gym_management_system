const { Payment, User, Membership } = require('../models');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Email transporter (configure in .env)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send payment confirmation email
 */
const sendPaymentEmail = async (user, payment) => {
  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Payment Confirmation - Gym Management',
        html: `
          <h2>Payment Confirmation</h2>
          <p>Dear ${user.name},</p>
          <p>Your payment has been successfully processed.</p>
          <p><strong>Amount:</strong> ₹${payment.amount}</p>
          <p><strong>Payment Date:</strong> ${new Date(payment.payment_date).toLocaleDateString()}</p>
          <p><strong>Payment Method:</strong> ${payment.payment_method}</p>
          <p>Thank you for your business!</p>
        `
      });
    }
  } catch (error) {
    console.error('Email send error:', error);
  }
};

/**
 * @route   GET /api/payments
 * @desc    Get all payments
 */
exports.getAllPayments = async (req, res) => {
  try {
    const whereClause = {};
    
    // Filter by user if user_id is provided
    if (req.query.userId) {
      whereClause.user_id = req.query.userId;
    }

    const payments = await Payment.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'user', attributes: ['user_id', 'name', 'email'] },
        { model: Membership, as: 'membership', attributes: ['membership_id', 'type', 'price'] }
      ],
      order: [['payment_date', 'DESC']]
    });

    res.json({
      success: true,
      count: payments.length,
      data: { payments }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

/**
 * @route   GET /api/payments/:id
 * @desc    Get payment by ID
 */
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['user_id', 'name', 'email'] },
        { model: Membership, as: 'membership', attributes: ['membership_id', 'type', 'price'] }
      ]
    });

    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    res.json({
      success: true,
      data: { payment }
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

/**
 * @route   POST /api/payments
 * @desc    Create new payment
 */
exports.createPayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { amount, payment_method, user_id, membership_id } = req.body;

    // Verify user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Verify membership exists if provided
    if (membership_id) {
      const membership = await Membership.findByPk(membership_id);
      if (!membership) {
        return res.status(404).json({ 
          success: false, 
          message: 'Membership not found' 
        });
      }
    }

    // Create payment
    const payment = await Payment.create({
      amount,
      payment_method,
      user_id,
      membership_id,
      payment_date: new Date()
    });

    // Fetch with associations
    const createdPayment = await Payment.findByPk(payment.payment_id, {
      include: [
        { model: User, as: 'user', attributes: ['user_id', 'name', 'email'] },
        { model: Membership, as: 'membership', attributes: ['membership_id', 'type', 'price'] }
      ]
    });

    // Send confirmation email (async, don't wait)
    sendPaymentEmail(user, createdPayment).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: { payment: createdPayment }
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

/**
 * @route   GET /api/payments/user/:userId
 * @desc    Get payment history for a user
 */
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { user_id: req.params.userId },
      include: [
        { model: Membership, as: 'membership', attributes: ['membership_id', 'type', 'price'] }
      ],
      order: [['payment_date', 'DESC']]
    });

    res.json({
      success: true,
      count: payments.length,
      data: { payments }
    });
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

/**
 * @route   DELETE /api/payments/:id
 * @desc    Delete payment
 */
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    await payment.destroy();

    res.json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Validation rules
exports.validatePayment = [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('payment_method').isIn(['UPI', 'Card', 'Cash', 'Net Banking']).withMessage('Invalid payment method'),
  body('user_id').isInt().withMessage('User ID must be an integer'),
  body('membership_id').optional().isInt().withMessage('Membership ID must be an integer')
];

