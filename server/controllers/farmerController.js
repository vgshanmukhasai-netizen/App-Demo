const { Op } = require('sequelize');
const { Farmer } = require('../models/Farmer');
const { sendSuccess, sendError } = require('../utils/responseUtils');

/**
 * @route   GET /api/farmers/me
 * @desc    Get logged-in farmer's profile
 * @access  Protected
 */
const getProfile = async (req, res, next) => {
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

/**
 * @route   PUT /api/farmers/me
 * @desc    Update logged-in farmer's profile
 * @access  Protected
 */
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'phone', 'location', 'landDetails'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return sendError(res, 'No valid fields provided for update.', 400);
    }

    // Check phone uniqueness if updating phone
    if (updates.phone) {
      const existing = await Farmer.findOne({
        where: { phone: updates.phone, id: { [Op.ne]: req.farmerId } },
      });
      if (existing) {
        return sendError(res, 'Phone number already in use by another account.', 409);
      }
    }

    const [affectedCount] = await Farmer.update(updates, { where: { id: req.farmerId } });
    if (affectedCount === 0) {
      return sendError(res, 'Farmer not found.', 404);
    }

    const farmer = await Farmer.findByPk(req.farmerId, {
      attributes: { exclude: ['passwordHash'] },
    });

    sendSuccess(res, { farmer }, 'Profile updated successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/farmers/me
 * @desc    Delete farmer account
 * @access  Protected
 */
const deleteAccount = async (req, res, next) => {
  try {
    await Farmer.destroy({ where: { id: req.farmerId } });
    sendSuccess(res, null, 'Account deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, deleteAccount };
