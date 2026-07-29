import { Router } from 'express';
import * as commentController from '../controllers/commentController.js';
import { protect } from '../middlewares/auth.js';
import { commentValidate } from '../validators/commentValidator.js';

const router = Router();

// Public route to view discussion
router.get('/item/:itemId', commentController.getCommentsForItem);

// Protected routes to write / delete comments
router.use(protect);

router.post('/', commentValidate, commentController.createComment);
router.delete('/:id', commentController.deleteComment);

export default router;
