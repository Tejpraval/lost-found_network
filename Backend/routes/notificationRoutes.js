import { Router } from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

// Protect all routes inside this file
router.use(protect);

router.get('/', notificationController.getMyNotifications);
router.patch('/read-all', notificationController.markAllNotificationsAsRead);
router.patch('/:id/read', notificationController.markNotificationAsRead);

export default router;
