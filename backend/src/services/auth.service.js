const userRepository = require('../repositories/user.repository');
const { hashPassword, comparePassword, generateToken, sanitizeUser } = require('../utils/crypto.utils');
const logger = require('../config/logger');

class AuthService {
  /**
   * Registra um novo usuário
   * @param {Object} userData - Dados do usuário
   * @returns {Promise<Object>} Usuário criado e token
   */
  async register(userData) {
    try {
      const { name, email, password } = userData;

      // Verificar se email já existe
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        throw new Error('Email já está em uso');
      }

      // Hash da senha
      const hashedPassword = await hashPassword(password);

      // Criar usuário
      const user = await userRepository.create({
        name,
        email,
        password: hashedPassword
      });

      // Gerar token
      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name
      });


      return {
        user,
        token
      };
    } catch (error) {
      logger.error('Erro no registro de usuário:', error);
      throw error;
    }
  }

  /**
   * Autentica um usuário
   * @param {Object} credentials - Credenciais de login
   * @returns {Promise<Object>} Usuário e token
   */
  async login(credentials) {
    try {
      const { email, password } = credentials;

      // Buscar usuário por email
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new Error('Credenciais inválidas');
      }

      // Verificar se usuário está ativo
      if (!user.isActive) {
        throw new Error('Usuário desativado');
      }

      // Verificar senha
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Credenciais inválidas');
      }

      // Gerar token
      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name
      });


      return {
        user: sanitizeUser(user),
        token
      };
    } catch (error) {
      logger.error('Erro no login:', error);
      throw error;
    }
  }

  /**
   * Valida token e retorna dados do usuário
   * @param {string} token - Token JWT
   * @returns {Promise<Object>} Dados do usuário
   */
  async validateToken(token) {
    try {
      const { verifyToken } = require('../utils/crypto.utils');
      const decoded = verifyToken(token);

      // Buscar usuário atualizado
      const user = await userRepository.findById(decoded.id);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (!user.isActive) {
        throw new Error('Usuário desativado');
      }

      return user;
    } catch (error) {
      logger.error('Erro na validação do token:', error);
      throw error;
    }
  }

  /**
   * Atualiza perfil do usuário
   * @param {number} userId - ID do usuário
   * @param {Object} updateData - Dados para atualização
   * @returns {Promise<Object>} Usuário atualizado
   */
  async updateProfile(userId, updateData) {
    try {
      const { name, email, password } = updateData;
      const updateFields = {};

      // Verificar se email já existe (se fornecido)
      if (email) {
        const emailExists = await userRepository.emailExists(email, userId);
        if (emailExists) {
          throw new Error('Email já está em uso');
        }
        updateFields.email = email;
      }

      // Atualizar nome (se fornecido)
      if (name) {
        updateFields.name = name;
      }

      // Atualizar senha (se fornecida)
      if (password) {
        updateFields.password = await hashPassword(password);
      }

      const updatedUser = await userRepository.update(userId, updateFields);
      if (!updatedUser) {
        throw new Error('Usuário não encontrado');
      }


      return updatedUser;
    } catch (error) {
      logger.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }

  /**
   * Desativa um usuário
   * @param {number} userId - ID do usuário
   * @returns {Promise<boolean>} True se desativado com sucesso
   */
  async deactivateUser(userId) {
    try {
      const result = await userRepository.updateStatus(userId, false);
      if (!result) {
        throw new Error('Usuário não encontrado');
      }

      return true;
    } catch (error) {
      logger.error('Erro ao desativar usuário:', error);
      throw error;
    }
  }

  /**
   * Reativa um usuário
   * @param {number} userId - ID do usuário
   * @returns {Promise<boolean>} True se reativado com sucesso
   */
  async activateUser(userId) {
    try {
      const result = await userRepository.updateStatus(userId, true);
      if (!result) {
        throw new Error('Usuário não encontrado');
      }

      return true;
    } catch (error) {
      logger.error('Erro ao reativar usuário:', error);
      throw error;
    }
  }

  /**
   * Lista usuários com paginação
   * @param {Object} options - Opções de paginação e filtros
   * @returns {Promise<Object>} Lista de usuários
   */
  async listUsers(options = {}) {
    try {
      return await userRepository.findAll(options);
    } catch (error) {
      logger.error('Erro ao listar usuários:', error);
      throw error;
    }
  }

  /**
   * Busca usuário por ID
   * @param {number} userId - ID do usuário
   * @returns {Promise<Object>} Usuário encontrado
   */
  async getUserById(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      return user;
    } catch (error) {
      logger.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();

