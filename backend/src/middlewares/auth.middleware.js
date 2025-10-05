const { verifyToken, extractTokenFromHeader } = require('../utils/crypto.utils');
const logger = require('../config/logger');

/**
 * Middleware de autenticação JWT
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        error: 'Token de acesso não fornecido',
        details: 'Header Authorization com Bearer token é obrigatório'
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Erro na autenticação:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        details: 'Faça login novamente para continuar'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido',
        details: 'Token de acesso não é válido'
      });
    }

    return res.status(500).json({
      error: 'Erro interno do servidor',
      details: 'Erro ao processar autenticação'
    });
  }
};

/**
 * Middleware para verificar se o usuário está ativo
 */
const checkUserActive = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Usuário não autenticado'
      });
    }

    // Aqui você pode adicionar lógica para verificar se o usuário está ativo
    // Por exemplo, consultar o banco de dados
    next();
  } catch (error) {
    logger.error('Erro ao verificar status do usuário:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      details: 'Erro ao verificar status do usuário'
    });
  }
};

/**
 * Middleware para verificar permissões de admin (opcional)
 */
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Usuário não autenticado'
      });
    }

    // Aqui você pode adicionar lógica para verificar se o usuário é admin
    // Por exemplo: if (req.user.role !== 'admin') { ... }
    
    next();
  } catch (error) {
    logger.error('Erro ao verificar permissões de admin:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      details: 'Erro ao verificar permissões'
    });
  }
};

module.exports = {
  authenticateToken,
  checkUserActive,
  requireAdmin
};

