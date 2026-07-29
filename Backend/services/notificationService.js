import Notification from '../models/Notification.js';
import AppError from '../utils/AppError.js';

export const createNotification = async (recipientId, senderId, type, itemId, claimId = null) => {
  // Prevent notifying self
  if (recipientId.toString() === senderId.toString()) return null;

  const notification = await Notification.create({
    recipient: recipientId,
    sender: senderId,
    type,
    item: itemId,
    claim: claimId
  });

  return notification;
};

export const getMyNotifications = async (userId) => {
  const notifications = await Notification.find({ recipient: userId })
    .sort('-createdAt')
    .populate('sender', 'name avatar')
    .populate('item', 'title type');
  return notifications;
};

export const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  if (notification.recipient.toString() !== userId.toString()) {
    throw new AppError('Not authorized to read this notification', 403);
  }

  notification.isRead = true;
  await notification.save();
  return notification;
};

export const markAllNotificationsAsRead = async (userId) => {
  await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
};
