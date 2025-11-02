const { Membership, User, Staff } = require('../models');
const { calculateEndDate, getMembershipPrice, isMembershipExpired } = require('../utils/membershipCalculator');
const { body, validationResult } = require('express-validator');

/**
 * @route   GET /api/memberships
 * @desc    Get all memberships
 */
exports.getAllMemberships = async (req, res) => {
  try {
    const whereClause = {};
    
    // Filter by user if user_id is provided
    if (req.query.userId) {
      whereClause.user_id = req.query.userId;
    }

    const memberships = await Membership.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'user', attributes: ['user_id', 'name', 'email', 'phone'] },
        { model: Staff, as: 'staff', attributes: ['staff_id', 'name', 'role'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      count: memberships.length,
      data: { memberships }
    });
  } catch (error) {
    console.error('Get memberships error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

/**
 * @route   GET /api/memberships/:id
 * @desc    Get membership by ID
 */
exports.getMembershipById = async (req, res) => {
  try {
    const membership = await Membership.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['user_id', 'name', 'email', 'phone'] },
        { model: Staff, as: 'staff', attributes: ['staff_id', 'name', 'role'] }
      ]
    });

    if (!membership) {
      return res.status(404).json({ 
        success: false, 
        message: 'Membership not found' 
      });
    }

    res.json({
      success: true,
      data: { membership }
    });
  } catch (error) {
    console.error('Get membership error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

/**
 * @route   POST /api/memberships
 * @desc    Create new membership
 */
exports.createMembership = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { type, user_id, staff_id, start_date } = req.body;

    // Verify user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Verify staff exists
    const staff = await Staff.findByPk(staff_id);
    if (!staff) {
      return res.status(404).json({ 
        success: false, 
        message: 'Staff not found' 
      });
    }

    // Calculate end date and price
    const actualStartDate = start_date ? new Date(start_date) : new Date();
    const end_date = calculateEndDate(actualStartDate, type);
    const price = getMembershipPrice(type);

    // Create membership
    const membership = await Membership.create({
      type,
      start_date: actualStartDate,
      end_date,
      price,
      user_id,
      staff_id
    });

    // Fetch with associations
    const createdMembership = await Membership.findByPk(membership.membership_id, {
      include: [
        { model: User, as: 'user', attributes: ['user_id', 'name', 'email', 'phone'] },
        { model: Staff, as: 'staff', attributes: ['staff_id', 'name', 'role'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Membership created successfully',
      data: { membership: createdMembership }
    });
  } catch (error) {
    console.error('Create membership error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

/**
 * @route   PUT /api/memberships/:id
 * @desc    Update membership
 */
exports.updateMembership = async (req, res) => {
  try {
    const membership = await Membership.findByPk(req.params.id);
    if (!membership) {
      return res.status(404).json({ 
        success: false, 
        message: 'Membership not found' 
      });
    }

    // If type or start_date is updated, recalculate end_date
    if (req.body.type || req.body.start_date) {
      const newType = req.body.type || membership.type;
      const newStartDate = req.body.start_date ? new Date(req.body.start_date) : membership.start_date;
      req.body.end_date = calculateEndDate(newStartDate, newType);
      
      if (req.body.type) {
        req.body.price = getMembershipPrice(newType);
      }
    }

    await membership.update(req.body);

    const updatedMembership = await Membership.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['user_id', 'name', 'email', 'phone'] },
        { model: Staff, as: 'staff', attributes: ['staff_id', 'name', 'role'] }
      ]
    });

    res.json({
      success: true,
      message: 'Membership updated successfully',
      data: { membership: updatedMembership }
    });
  } catch (error) {
    console.error('Update membership error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

/**
 * @route   DELETE /api/memberships/:id
 * @desc    Delete membership
 */
exports.deleteMembership = async (req, res) => {
  try {
    const membership = await Membership.findByPk(req.params.id);
    if (!membership) {
      return res.status(404).json({ 
        success: false, 
        message: 'Membership not found' 
      });
    }

    await membership.destroy();

    res.json({
      success: true,
      message: 'Membership deleted successfully'
    });
  } catch (error) {
    console.error('Delete membership error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Validation rules
exports.validateMembership = [
  body('type').isIn(['Basic', 'Premium Plus', 'Elite Pro', 'Annual Unlimited']).withMessage('Invalid membership type'),
  body('user_id').isInt().withMessage('User ID must be an integer'),
  body('staff_id').isInt().withMessage('Staff ID must be an integer'),
  body('start_date').optional().isISO8601().withMessage('Invalid date format')
];

