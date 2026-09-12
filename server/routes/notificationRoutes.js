const express = require('express');
const { getNotifications, markAsRead, markAllAsRead, clearRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/clear', clearRead);

module.exports = router;
