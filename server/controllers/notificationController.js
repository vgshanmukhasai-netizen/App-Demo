const { Notification } = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/responseUtils');

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for logged-in farmer
 * @access  Protected
 */
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: { farmerId: req.farmerId },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });

    const unreadCount = await Notification.count({
      where: { farmerId: req.farmerId, isRead: false },
    });

    sendSuccess(res, { notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark a notification as read
 * @access  Protected
 */
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, farmerId: req.farmerId },
    });

    if (!notification) {
      return sendError(res, 'Notification not found.', 404);
    }

    await notification.update({ isRead: true });
    sendSuccess(res, { notification }, 'Marked as read.');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Protected
 */
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { farmerId: req.farmerId, isRead: false } }
    );
    sendSuccess(res, null, 'All notifications marked as read.');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/notifications/clear
 * @desc    Clear all read notifications
 * @access  Protected
 */
const clearRead = async (req, res, next) => {
  try {
    await Notification.destroy({ where: { farmerId: req.farmerId, isRead: true } });
    sendSuccess(res, null, 'Read notifications cleared.');
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, clearRead };
