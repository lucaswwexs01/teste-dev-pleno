const { body, param, query, validationResult } = require('express-validator');
const logger = require('../config/logger');

/**
 * Middleware para tratar erros de validação
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));

    logger.warn('Erros de validação:', errorMessages);
    
    return res.status(400).json({
      error: 'Dados inválidos',
      details: errorMessages
    });
  }
  
  next();
};

/**
 * Validações para registro de usuário
 */
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email deve ter um formato válido'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  
  handleValidationErrors
];

/**
 * Validações para login
 */
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email deve ter um formato válido'),
  
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
  
  handleValidationErrors
];

/**
 * Validações para operações
 */
const validateOperation = [
  body('type')
    .isIn(['purchase', 'sale'])
    .withMessage('Tipo deve ser "purchase" ou "sale"'),
  
  body('fuelType')
    .isIn(['gasoline', 'ethanol', 'diesel'])
    .withMessage('Tipo de combustível deve ser "gasoline", "ethanol" ou "diesel"'),
  
  body('quantity')
    .isFloat({ min: 0.001, max: 1000000 })
    .withMessage('Quantidade deve ser um número entre 0.001 e 1.000.000 litros'),
  
  body('month')
    .isInt({ min: 1, max: 12 })
    .withMessage('Mês deve ser um número entre 1 e 12'),
  
  body('year')
    .optional()
    .isInt({ min: 2020, max: new Date().getFullYear() })
    .withMessage('Ano deve ser um número válido'),
  
  handleValidationErrors
];

/**
 * Validações para parâmetros de ID
 */
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID deve ser um número inteiro positivo'),
  
  handleValidationErrors
];

/**
 * Validações para query parameters
 */
const validateQueryParams = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número inteiro positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve ser um número entre 1 e 100'),
  
  query('month')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Mês deve ser um número entre 1 e 12'),
  
  query('year')
    .optional()
    .isInt({ min: 2020, max: new Date().getFullYear() })
    .withMessage('Ano deve ser um número válido'),
  
  query('type')
    .optional()
    .isIn(['purchase', 'sale'])
    .withMessage('Tipo deve ser "purchase" ou "sale"'),
  
  query('fuelType')
    .optional()
    .isIn(['gasoline', 'ethanol', 'diesel'])
    .withMessage('Tipo de combustível deve ser "gasoline", "ethanol" ou "diesel"'),
  
  handleValidationErrors
];

/**
 * Middleware para sanitizar dados de entrada
 */
const sanitizeInput = (req, res, next) => {
  // Sanitizar strings removendo espaços extras
  const sanitizeString = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim();
      }
    }
  };

  if (req.body) {
    sanitizeString(req.body);
  }
  
  if (req.query) {
    sanitizeString(req.query);
  }
  
  next();
};

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateOperation,
  validateId,
  validateQueryParams,
  sanitizeInput
};

