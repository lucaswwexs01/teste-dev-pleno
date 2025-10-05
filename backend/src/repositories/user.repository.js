const { User } = require('../database/models');
const { sanitizeUser } = require('../utils/crypto.utils');
const logger = require('../config/logger');

class UserRepository {
  /**
   * Cria um novo usuário
   * @param {Object} userData - Dados do usuário
   * @returns {Promise<Object>} Usuário criado
   */
  async create(userData) {
    try {
      const user = await User.create(userData);
      return sanitizeUser(user);
    } catch (error) {
      logger.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  /**
   * Busca usuário por ID
   * @param {number} id - ID do usuário
   * @returns {Promise<Object|null>} Usuário encontrado ou null
   */
  async findById(id) {
    try {
      const user = await User.findByPk(id);
      return user ? sanitizeUser(user) : null;
    } catch (error) {
      logger.error('Erro ao buscar usuário por ID:', error);
      throw error;
    }
  }

  /**
   * Busca usuário por email
   * @param {string} email - Email do usuário
   * @returns {Promise<Object|null>} Usuário encontrado ou null
   */
  async findByEmail(email) {
    try {
      const user = await User.findOne({
        where: { email }
      });
      return user;
    } catch (error) {
      logger.error('Erro ao buscar usuário por email:', error);
      throw error;
    }
  }

  /**
   * Lista todos os usuários com paginação
   * @param {Object} options - Opções de paginação e filtros
   * @returns {Promise<Object>} Lista de usuários e metadados
   */
  async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        order = [['createdAt', 'DESC']],
        where = {}
      } = options;

      const offset = (page - 1) * limit;

      const { count, rows } = await User.findAndCountAll({
        where,
        order,
        limit: parseInt(limit),
        offset: parseInt(offset),
        attributes: { exclude: ['password'] }
      });

      return {
        users: rows.map(user => sanitizeUser(user)),
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      logger.error('Erro ao listar usuários:', error);
      throw error;
    }
  }

  /**
   * Atualiza um usuário
   * @param {number} id - ID do usuário
   * @param {Object} updateData - Dados para atualização
   * @returns {Promise<Object|null>} Usuário atualizado ou null
   */
  async update(id, updateData) {
    try {
      const [affectedRows] = await User.update(updateData, {
        where: { id }
      });

      if (affectedRows === 0) {
        return null;
      }

      const updatedUser = await this.findById(id);
      return updatedUser;
    } catch (error) {
      logger.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  /**
   * Remove um usuário
   * @param {number} id - ID do usuário
   * @returns {Promise<boolean>} True se removido com sucesso
   */
  async delete(id) {
    try {
      const deletedRows = await User.destroy({
        where: { id }
      });

      return deletedRows > 0;
    } catch (error) {
      logger.error('Erro ao remover usuário:', error);
      throw error;
    }
  }

  /**
   * Verifica se email já existe
   * @param {string} email - Email a ser verificado
   * @param {number} excludeId - ID do usuário a ser excluído da verificação
   * @returns {Promise<boolean>} True se email existe
   */
  async emailExists(email, excludeId = null) {
    try {
      const whereClause = { email };
      if (excludeId) {
        whereClause.id = { [require('sequelize').Op.ne]: excludeId };
      }

      const user = await User.findOne({ where: whereClause });
      return !!user;
    } catch (error) {
      logger.error('Erro ao verificar existência do email:', error);
      throw error;
    }
  }

  /**
   * Ativa/desativa um usuário
   * @param {number} id - ID do usuário
   * @param {boolean} isActive - Status ativo
   * @returns {Promise<Object|null>} Usuário atualizado ou null
   */
  async updateStatus(id, isActive) {
    try {
      return await this.update(id, { isActive });
    } catch (error) {
      logger.error('Erro ao atualizar status do usuário:', error);
      throw error;
    }
  }
}

module.exports = new UserRepository();

