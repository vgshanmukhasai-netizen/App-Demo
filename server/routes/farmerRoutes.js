const express = require('express');
const { getProfile, updateProfile, deleteAccount } = require('../controllers/farmerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.delete('/me', deleteAccount);

module.exports = router;
