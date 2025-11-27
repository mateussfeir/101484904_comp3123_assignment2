const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();
const {
  getAllEmployees,
  searchEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const authenticate = require('../middleware/auth');
const upload = require('../middleware/upload');
const validateRequest = require('../middleware/validateRequest');

const employeeIdValidation = [param('eid').isMongoId().withMessage('Invalid employee id')];

const employeeCreateValidation = [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('position').trim().notEmpty().withMessage('Position is required'),
  body('salary').isFloat({ gt: 0 }).withMessage('Salary must be greater than 0'),
  body('date_of_joining').isISO8601().withMessage('Date of joining must be a valid date'),
  body('department').trim().notEmpty().withMessage('Department is required'),
];

const employeeUpdateValidation = [
  body('first_name').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('last_name').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Email must be valid'),
  body('position').optional().trim().notEmpty().withMessage('Position cannot be empty'),
  body('salary').optional().isFloat({ gt: 0 }).withMessage('Salary must be greater than 0'),
  body('date_of_joining')
    .optional()
    .isISO8601()
    .withMessage('Date of joining must be a valid date'),
  body('department').optional().trim().notEmpty().withMessage('Department cannot be empty'),
];

const employeeSearchValidation = [
  query('department').optional().trim().notEmpty().withMessage('Department cannot be empty'),
  query('position').optional().trim().notEmpty().withMessage('Position cannot be empty'),
  query().custom((_, { req }) => {
    if (!req.query.department && !req.query.position) {
      throw new Error('Provide department or position to search');
    }
    return true;
  }),
];

// Employee management routes
router.get('/employees', authenticate, getAllEmployees);
router.get(
  '/employees/search',
  authenticate,
  employeeSearchValidation,
  validateRequest,
  searchEmployees
);
router.post(
  '/employees',
  authenticate,
  upload.single('profile_picture'),
  employeeCreateValidation,
  validateRequest,
  createEmployee
);
router.get(
  '/employees/:eid',
  authenticate,
  employeeIdValidation,
  validateRequest,
  getEmployeeById
);
router.put(
  '/employees/:eid',
  authenticate,
  upload.single('profile_picture'),
  employeeIdValidation,
  employeeUpdateValidation,
  validateRequest,
  updateEmployee
);
router.delete(
  '/employees/:eid',
  authenticate,
  employeeIdValidation,
  validateRequest,
  deleteEmployee
);

module.exports = router;
