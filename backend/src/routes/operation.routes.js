const express = require('express');
const operationController = require('../controllers/operation.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { 
  validateOperation, 
  validateId,
  validateQueryParams,
  sanitizeInput 
} = require('../middlewares/validate.middleware');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// CRUD de operações
router.post('/', 
  sanitizeInput,
  validateOperation,
  operationController.createOperation
);

router.get('/', 
  validateQueryParams,
  operationController.listOperations
);

router.get('/statistics', 
  validateQueryParams,
  operationController.getStatistics
);

router.get('/difference', 
  validateQueryParams,
  operationController.getPurchaseSaleDifference
);

router.get('/report', 
  validateQueryParams,
  operationController.generateReport
);

router.post('/preview',
  sanitizeInput,
  operationController.calculatePreview
);

router.get('/:id', 
  validateId,
  operationController.getOperationById
);

router.put('/:id', 
  sanitizeInput,
  validateId,
  operationController.updateOperation
);

router.delete('/:id', 
  validateId,
  operationController.deleteOperation
);

module.exports = router;

