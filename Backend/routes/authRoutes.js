import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { registerRules, loginRules, validate } from '../validators/authValidator.js';

const router = Router();

router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);

export default router;
