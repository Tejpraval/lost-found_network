import { body } from 'express-validator';
import { validate } from './authValidator.js';

export const commentRules = [
  body('item')
    .isMongoId()
    .withMessage('Invalid item ID format'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters')
];

export const commentValidate = [commentRules, validate];
