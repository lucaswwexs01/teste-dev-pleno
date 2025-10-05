const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Gera hash da senha usando bcrypt
 * @param {string} password - Senha em texto plano
 * @returns {Promise<string>} Hash da senha
 */
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compara senha em texto plano com hash
 * @param {string} password - Senha em texto plano
 * @param {string} hash - Hash da senha
 * @returns {Promise<boolean>} True se as senhas coincidem
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Gera token JWT
 * @param {Object} payload - Dados do usuário
 * @returns {string} Token JWT
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

/**
 * Verifica e decodifica token JWT
 * @param {string} token - Token JWT
 * @returns {Object} Dados decodificados do token
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Extrai token do header Authorization
 * @param {string} authHeader - Header Authorization
 * @returns {string|null} Token extraído ou null
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

/**
 * Valida formato de email
 * @param {string} email - Email a ser validado
 * @returns {boolean} True se email é válido
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida força da senha
 * @param {string} password - Senha a ser validada
 * @returns {Object} Resultado da validação
 */
const validatePasswordStrength = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const isValid = password.length >= minLength;
  const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
  
  return {
    isValid,
    strength,
    requirements: {
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    }
  };
};

/**
 * Gera senha aleatória
 * @param {number} length - Comprimento da senha
 * @returns {string} Senha gerada
 */
const generateRandomPassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
};

/**
 * Sanitiza dados do usuário para resposta
 * @param {Object} user - Objeto do usuário
 * @returns {Object} Usuário sem dados sensíveis
 */
const sanitizeUser = (user) => {
  const { password, ...sanitizedUser } = user.toJSON ? user.toJSON() : user;
  return sanitizedUser;
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  extractTokenFromHeader,
  isValidEmail,
  validatePasswordStrength,
  generateRandomPassword,
  sanitizeUser
};

