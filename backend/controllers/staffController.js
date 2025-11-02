const { Staff } = require('../models');
const { body, validationResult } = require('express-validator');

/**
 * @route   GET /api/staff
 * @desc    Get all staff members
 */
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll({
      order: [['hire_date', 'DESC']]
    });

    res.json({
      success: true,
      count: staff.length,
      data: { staff }
    });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

/**
 * @route   GET /api/staff/:id
 * @desc    Get staff by ID
 */
exports.getStaffById = async (req, res) => {
  try {
    const staffMember = await Staff.findByPk(req.params.id);

    if (!staffMember) {
      return res.status(404).json({ 
        success: false, 
        message: 'Staff not found' 
      });
    }

    res.json({
      success: true,
      data: { staff: staffMember }
    });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

/**
 * @route   POST /api/staff
 * @desc    Create new staff member
 */
exports.createStaff = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const staff = await Staff.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: { staff }
    });
  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

/**
 * @route   PUT /api/staff/:id
 * @desc    Update staff member
 */
exports.updateStaff = async (req, res) => {
  try {
    const staffMember = await Staff.findByPk(req.params.id);
    if (!staffMember) {
      return res.status(404).json({ 
        success: false, 
        message: 'Staff not found' 
      });
    }

    await staffMember.update(req.body);

    res.json({
      success: true,
      message: 'Staff member updated successfully',
      data: { staff: staffMember }
    });
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

/**
 * @route   DELETE /api/staff/:id
 * @desc    Delete staff member
 */
exports.deleteStaff = async (req, res) => {
  try {
    const staffMember = await Staff.findByPk(req.params.id);
    if (!staffMember) {
      return res.status(404).json({ 
        success: false, 
        message: 'Staff not found' 
      });
    }

    await staffMember.destroy();

    res.json({
      success: true,
      message: 'Staff member deleted successfully'
    });
  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Validation rules
exports.validateStaff = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('role').isIn(['Trainer', 'Manager', 'Receptionist']).withMessage('Invalid role')
];

