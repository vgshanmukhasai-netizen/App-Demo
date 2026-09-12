const { Op } = require('sequelize');
const { MarketData } = require('../models/MarketData');
const { sendSuccess, sendError } = require('../utils/responseUtils');

/**
 * @route   GET /api/market
 * @desc    Get all market data
 * @access  Protected
 */
const getAllMarketData = async (req, res, next) => {
  try {
    const data = await MarketData.findAll({
      order: [['demandLevel', 'DESC'], ['updatedAt', 'DESC']],
    });
    sendSuccess(res, { marketData: data, count: data.length });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/market/:cropName
 * @desc    Get market data for a specific crop
 * @access  Protected
 */
const getMarketDataByCrop = async (req, res, next) => {
  try {
    const data = await MarketData.findOne({
      where: { cropName: { [Op.like]: req.params.cropName } },
    });

    if (!data) {
      return sendError(res, 'Market data not found for this crop.', 404);
    }

    sendSuccess(res, { marketData: data });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllMarketData, getMarketDataByCrop };
