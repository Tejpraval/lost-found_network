import { body } from 'express-validator';
import { validate } from './authValidator.js';

export const claimRules = [
  body('item')
    .isMongoId()
    .withMessage('Invalid item ID format'),
  body('answers')
    .isArray({ min: 1 })
    .withMessage('Answers must be provided as an array'),
  body('message')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters')
];

export const claimValidate = [claimRules, validate];
