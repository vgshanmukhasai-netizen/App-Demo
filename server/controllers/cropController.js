const { Op } = require('sequelize');
const { Crop, GROWTH_STAGES } = require('../models/Crop');
const { WateringLog } = require('../models/WateringLog');
const { sendSuccess, sendError } = require('../utils/responseUtils');

/**
 * @route   GET /api/crops
 * @desc    Get all crops for the logged-in farmer
 * @access  Protected
 */
const getCrops = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = { farmerId: req.farmerId };
    if (status) where.status = status;

    const crops = await Crop.findAll({ where, order: [['createdAt', 'DESC']] });
    sendSuccess(res, { crops, count: crops.length });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/crops
 * @desc    Add a new crop
 * @access  Protected
 */
const addCrop = async (req, res, next) => {
  try {
    const {
      cropName, landArea, areaUnit, plantingDate,
      expectedHarvestDate, expectedYield, yieldUnit,
      soilType, waterAvailability, notes, offlineId
    } = req.body;

    if (!cropName || !landArea || !plantingDate) {
      return sendError(res, 'Crop name, land area, and planting date are required.', 400);
    }

    const crop = await Crop.create({
      farmerId: req.farmerId,
      cropName,
      landArea,
      areaUnit,
      plantingDate,
      expectedHarvestDate: expectedHarvestDate || null,
      expectedYield: expectedYield || null,
      yieldUnit,
      soilType,
      waterAvailability,
      notes,
      offlineId: offlineId || null,
      growthHistory: [{ stage: 'Planting', recordedAt: new Date(plantingDate), notes: '' }],
    });

    sendSuccess(res, { crop }, 'Crop added successfully.', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/crops/:id
 * @desc    Get one crop (must belong to logged-in farmer)
 * @access  Protected
 */
const getCropById = async (req, res, next) => {
  try {
    const crop = await Crop.findOne({ where: { id: req.params.id, farmerId: req.farmerId } });
    if (!crop) {
      return sendError(res, 'Crop not found.', 404);
    }

    // Attach recent watering logs
    const wateringLogs = await WateringLog.findAll({
      where: { cropId: crop.id },
      order: [['wateredAt', 'DESC']],
      limit: 10,
    });

    sendSuccess(res, { crop, wateringLogs });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/crops/:id
 * @desc    Update a crop
 * @access  Protected
 */
const updateCrop = async (req, res, next) => {
  try {
    const allowedUpdates = [
      'cropName', 'landArea', 'areaUnit', 'expectedHarvestDate',
      'expectedYield', 'yieldUnit', 'soilType', 'waterAvailability',
      'status', 'notes', 'lastWateredAt', 'nextPlannedWatering'
    ];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const [affectedCount] = await Crop.update(updates, {
      where: { id: req.params.id, farmerId: req.farmerId },
    });

    if (affectedCount === 0) {
      return sendError(res, 'Crop not found.', 404);
    }

    const crop = await Crop.findOne({ where: { id: req.params.id, farmerId: req.farmerId } });
    sendSuccess(res, { crop }, 'Crop updated successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/crops/:id
 * @desc    Delete a crop
 * @access  Protected
 */
const deleteCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findOne({ where: { id: req.params.id, farmerId: req.farmerId } });
    if (!crop) {
      return sendError(res, 'Crop not found.', 404);
    }

    // Delete related watering logs first (cascade should handle it, but explicit for safety)
    await WateringLog.destroy({ where: { cropId: req.params.id } });
    await crop.destroy();

    sendSuccess(res, null, 'Crop deleted successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/crops/:id/stage
 * @desc    Update crop growth stage
 * @access  Protected
 */
const updateGrowthStage = async (req, res, next) => {
  try {
    const { stage, notes } = req.body;

    if (!stage || !GROWTH_STAGES.includes(stage)) {
      return sendError(res, `Invalid growth stage. Must be one of: ${GROWTH_STAGES.join(', ')}`, 400);
    }

    const crop = await Crop.findOne({ where: { id: req.params.id, farmerId: req.farmerId } });
    if (!crop) {
      return sendError(res, 'Crop not found.', 404);
    }

    // Append to growthHistory JSON array
    const history = crop.growthHistory || [];
    history.push({ stage, recordedAt: new Date(), notes: notes || '' });

    await crop.update({ currentGrowthStage: stage, growthHistory: history });

    sendSuccess(res, { crop }, `Growth stage updated to ${stage}.`);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/crops/:id/water
 * @desc    Log a watering event for a crop
 * @access  Protected
 */
const logWatering = async (req, res, next) => {
  try {
    const { wateredAt, method, durationMinutes, notes } = req.body;

    // Ensure crop belongs to this farmer
    const crop = await Crop.findOne({ where: { id: req.params.id, farmerId: req.farmerId } });
    if (!crop) {
      return sendError(res, 'Crop not found.', 404);
    }

    const wateringLog = await WateringLog.create({
      farmerId: req.farmerId,
      cropId: crop.id,
      wateredAt: wateredAt ? new Date(wateredAt) : new Date(),
      method: method || 'Manual',
      durationMinutes: durationMinutes || null,
      notes: notes || '',
    });

    // Update crop lastWateredAt
    await crop.update({ lastWateredAt: wateringLog.wateredAt });

    sendSuccess(res, { wateringLog }, 'Watering logged successfully.', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/crops/:id/watering
 * @desc    Get watering history for a crop
 * @access  Protected
 */
const getWateringHistory = async (req, res, next) => {
  try {
    const crop = await Crop.findOne({ where: { id: req.params.id, farmerId: req.farmerId } });
    if (!crop) {
      return sendError(res, 'Crop not found.', 404);
    }

    const logs = await WateringLog.findAll({
      where: { cropId: crop.id },
      order: [['wateredAt', 'DESC']],
    });
    sendSuccess(res, { logs, count: logs.length });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCrops,
  addCrop,
  getCropById,
  updateCrop,
  deleteCrop,
  updateGrowthStage,
  logWatering,
  getWateringHistory,
};
