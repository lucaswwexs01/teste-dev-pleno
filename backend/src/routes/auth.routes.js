const express = require('express');
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validateId,
  sanitizeInput 
} = require('../middlewares/validate.middleware');

const router = express.Router();


router.post('/register', 
  sanitizeInput,
  validateUserRegistration,
  authController.register
);

router.post('/login', 
  sanitizeInput,
  validateUserLogin,
  authController.login
);

router.get('/profile', 
  authenticateToken,
  authController.getProfile
);

router.put('/profile', 
  authenticateToken,
  sanitizeInput,
  authController.updateProfile
);

router.get('/users', 
  authenticateToken,
  authController.listUsers
);

router.get('/users/:id', 
  authenticateToken,
  validateId,
  authController.getUserById
);

router.patch('/users/:id/deactivate', 
  authenticateToken,
  validateId,
  authController.deactivateUser
);

router.patch('/users/:id/activate', 
  authenticateToken,
  validateId,
  authController.activateUser
);

module.exports = router;

