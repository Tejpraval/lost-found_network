import * as notificationService from '../services/notificationService.js';

export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getMyNotifications(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: {
        notifications
      }
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markNotificationAsRead(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Notification marked as read successfully',
      data: {
        notification
      }
    });
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    await notificationService.markAllNotificationsAsRead(req.user._id);

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
