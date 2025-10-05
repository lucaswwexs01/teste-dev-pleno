const logger = require('../config/logger');

/**
 * Middleware para tratamento global de erros
 */
const errorHandler = (err, req, res, next) => {
  logger.error('Erro capturado:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Erro de validação do Sequelize
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message,
      value: error.value
    }));

    return res.status(400).json({
      error: 'Erro de validação',
      details: errors
    });
  }

  // Erro de chave duplicada do Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'campo';
    return res.status(409).json({
      error: 'Conflito de dados',
      details: `${field} já existe no sistema`
    });
  }

  // Erro de chave estrangeira do Sequelize
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'Erro de relacionamento',
      details: 'Referência inválida a outro registro'
    });
  }

  // Erro de conexão com banco de dados
  if (err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      error: 'Serviço indisponível',
      details: 'Erro de conexão com o banco de dados'
    });
  }

  // Erro de timeout
  if (err.name === 'SequelizeTimeoutError') {
    return res.status(408).json({
      error: 'Timeout',
      details: 'Operação demorou muito para ser concluída'
    });
  }

  // Erro de sintaxe SQL
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      error: 'Erro interno do servidor',
      details: 'Erro no banco de dados'
    });
  }

  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido',
      details: 'Token de acesso não é válido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado',
      details: 'Faça login novamente para continuar'
    });
  }

  // Erro de sintaxe JSON
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'JSON inválido',
      details: 'Formato de dados inválido'
    });
  }

  // Erro de tamanho de payload
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Payload muito grande',
      details: 'Dados enviados excedem o tamanho máximo permitido'
    });
  }

  // Erro padrão
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(statusCode).json({
    error: message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

/**
 * Middleware para capturar rotas não encontradas
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Rota não encontrada: ${req.method} ${req.url}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Middleware para logging de requisições
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id || 'anonymous'
    };

    if (res.statusCode >= 400) {
      logger.warn('Requisição com erro:', logData);
    } else {
    }
  });

  next();
};

/**
 * Middleware para capturar erros assíncronos
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  requestLogger,
  asyncHandler
};

