import { Router } from 'express';
import * as itemController from '../controllers/itemController.js';
import { protect } from '../middlewares/auth.js';
import { uploadImages } from '../middlewares/upload.js';

const router = Router();

// Public Routes
router.get('/', itemController.getItems);
router.get('/:id', itemController.getItemById);

// Protected Routes
router.use(protect);

router.post('/', uploadImages, itemController.createItem);
router.patch('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

export default router;
