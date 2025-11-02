const { User, Login } = require('../models');
const { generateToken } = require('../utils/jwt');
const { body, validationResult } = require('express-validator');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
exports.register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, phone, email, address, username, password } = req.body;

    // Check if user already exists with email
    const existingUserByEmail = await User.findOne({ 
      where: { email } 
    });

    if (existingUserByEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    // Check if user already exists with phone
    const existingUserByPhone = await User.findOne({ 
      where: { phone } 
    });

    if (existingUserByPhone) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this phone number' 
      });
    }

    // Check if username already exists
    const existingLogin = await Login.findOne({ 
      where: { username } 
    });

    if (existingLogin) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username already taken' 
      });
    }

    // Create user
    const user = await User.create({
      name,
      phone,
      email,
      address,
      role: 'member'
    });

    // Create login credentials (password will be hashed automatically by Login model hook)
    await Login.create({
      username,
      password,
      user_id: user.user_id
    });

    // Generate token
    const token = generateToken(user.user_id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 */
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { username, password } = req.body;

    // Find login credentials
    const login = await Login.findOne({ 
      where: { username },
      include: [{ model: User, as: 'user' }]
    });

    if (!login || !login.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await login.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken(login.user.user_id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          user_id: login.user.user_id,
          name: login.user.name,
          email: login.user.email,
          phone: login.user.phone,
          role: login.user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Validation rules
exports.validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

exports.validateLogin = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

