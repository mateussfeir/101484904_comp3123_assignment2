const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { signup, login } = require('../controllers/userController');
const validateRequest = require('../middleware/validateRequest');

// Routes for user signup and login
const signupValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const loginValidation = [
  body('email').optional().isEmail().withMessage('Email must be valid'),
  body('username').optional().notEmpty().withMessage('Username cannot be empty'),
  body('password').notEmpty().withMessage('Password is required'),
  body().custom((_, { req }) => {
    if (!req.body.email && !req.body.username) {
      throw new Error('Email or username is required');
    }
    return true;
  }),
];

router.post('/signup', signupValidation, validateRequest, signup);
router.post('/login', loginValidation, validateRequest, login);

module.exports = router;
