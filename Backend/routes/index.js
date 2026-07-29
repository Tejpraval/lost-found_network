import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    data: {
      uptime: process.uptime(),
      status: 'UP'
    }
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
