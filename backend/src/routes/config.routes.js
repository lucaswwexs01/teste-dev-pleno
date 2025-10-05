const express = require('express');
const configController = require('../controllers/config.controller');

const router = express.Router();

router.get('/fuel-types', configController.getFuelTypes);
router.get('/operation-types', configController.getOperationTypes);
router.get('/months', configController.getMonths);
router.get('/years', configController.getYears);
router.get('/all', configController.getAllConfig);

module.exports = router;
