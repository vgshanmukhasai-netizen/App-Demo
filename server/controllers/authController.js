const { validationResult } = require('express-validator');
const { Farmer } = require('../models/Farmer');
const { hashPassword, comparePassword } = require('../utils/hashUtils');
const { generateToken } = require('../utils/jwtUtils');
const { sendSuccess, sendError } = require('../utils/responseUtils');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new farmer
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', 400, errors.array());
    }

    const { name, phone, email, password, location, landDetails } = req.body;

    // Check for existing farmer
    const { Op } = require('sequelize');
    const existingFarmer = await Farmer.findOne({ where: { [Op.or]: [{ email }, { phone }] } });
    if (existingFarmer) {
      const field = existingFarmer.email === email ? 'Email' : 'Phone number';
      return sendError(res, `${field} is already registered. Please login.`, 409);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create farmer
    const farmer = await Farmer.create({
      name,
      phone,
      email,
      passwordHash,
      location: location || {},
      landDetails: landDetails || {},
    });

    // Generate token
    const token = generateToken(farmer.id.toString(), farmer.email);

    const farmerData = {
      _id: farmer.id,
      name: farmer.name,
      phone: farmer.phone,
      email: farmer.email,
      location: farmer.location,
      landDetails: farmer.landDetails,
    };

    sendSuccess(res, { token, farmer: farmerData }, 'Registration successful. Welcome to AgroSelf!', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login farmer and return JWT
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', 400, errors.array());
    }

    const { email, password } = req.body;

    // Find farmer
    const farmer = await Farmer.findOne({ where: { email } });
    if (!farmer) {
      return sendError(res, 'No account found with this email. Please register.', 404);
    }

    // Compare password
    const isMatch = await comparePassword(password, farmer.passwordHash);
    if (!isMatch) {
      return sendError(res, 'Incorrect password. Please try again.', 401);
    }

    // Generate token
    const token = generateToken(farmer.id.toString(), farmer.email);

    const farmerData = {
      _id: farmer.id,
      name: farmer.name,
      phone: farmer.phone,
      email: farmer.email,
      location: farmer.location,
      landDetails: farmer.landDetails,
    };

    sendSuccess(res, { token, farmer: farmerData }, `Welcome back, ${farmer.name}!`);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated farmer
 * @access  Protected
 */
const getMe = async (req, res, next) => {
  try {
    const farmer = await Farmer.findByPk(req.farmerId, {
      attributes: { exclude: ['passwordHash'] },
    });
    if (!farmer) {
      return sendError(res, 'Farmer not found.', 404);
    }
    sendSuccess(res, { farmer });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
