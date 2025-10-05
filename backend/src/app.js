const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { specs, swaggerUi } = require('./config/swagger');
const routes = require('./routes');
const { errorHandler, notFoundHandler, requestLogger } = require('./middlewares/error.middleware');
const logger = require('./config/logger');

const app = express();

// Configurações de segurança
app.use(helmet());

// Configurações de CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limite de 100 requests por IP
  message: {
    error: 'Muitas requisições deste IP',
    details: 'Tente novamente em alguns minutos'
  }
});
app.use(limiter);

// Middleware de logging
app.use(requestLogger);

// Parser de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Fuel Tax API Documentation'
}));

// Rotas da API
app.use('/api', routes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Fuel Tax API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/api/health'
  });
});

// Middleware para rotas não encontradas
app.use(notFoundHandler);

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;

