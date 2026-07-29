import { Router } from 'express';
import * as claimController from '../controllers/claimController.js';
import { protect } from '../middlewares/auth.js';
import { claimValidate } from '../validators/claimValidator.js';

const router = Router();

// Protect all routes inside this file
router.use(protect);

router.post('/', claimValidate, claimController.createClaim);
router.get('/my-claims', claimController.getMyClaims);
router.get('/item/:itemId', claimController.getClaimsForItem);
router.patch('/:id/process', claimController.processClaim);

export default router;
