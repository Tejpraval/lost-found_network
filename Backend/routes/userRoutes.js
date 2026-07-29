import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/me', userController.getMe);
router.patch('/updateMe', userController.updateMe);

export default router;
