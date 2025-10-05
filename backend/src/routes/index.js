const express = require('express');
const authRoutes = require('./auth.routes');
const operationRoutes = require('./operation.routes');
const configRoutes = require('./config.routes');

const router = express.Router();

// Rotas de autenticação
router.use('/auth', authRoutes);

// Rotas de operações
router.use('/operations', operationRoutes);

// Rotas de configuração
router.use('/config', configRoutes);

// Rota de health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});


module.exports = router;

