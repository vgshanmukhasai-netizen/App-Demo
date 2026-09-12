const express = require('express');
const { getAllMarketData, getMarketDataByCrop } = require('../controllers/marketController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getAllMarketData);
router.get('/:cropName', getMarketDataByCrop);

module.exports = router;
