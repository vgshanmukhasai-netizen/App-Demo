const express = require('express');
const {
  getCrops, addCrop, getCropById, updateCrop, deleteCrop,
  updateGrowthStage, logWatering, getWateringHistory,
} = require('../controllers/cropController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes protected
router.use(protect);

router.get('/', getCrops);
router.post('/', addCrop);
router.get('/:id', getCropById);
router.put('/:id', updateCrop);
router.delete('/:id', deleteCrop);
router.post('/:id/stage', updateGrowthStage);
router.post('/:id/water', logWatering);
router.get('/:id/watering', getWateringHistory);

module.exports = router;
