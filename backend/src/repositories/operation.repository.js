const { Operation } = require('../database/models');
const logger = require('../config/logger');

class OperationRepository {
  /**
   * Cria uma nova operação
   * @param {Object} operationData - Dados da operação
   * @returns {Promise<Object>} Operação criada
   */
  async create(operationData) {
    try {
      const operation = await Operation.create(operationData);
      return operation;
    } catch (error) {
      logger.error('Erro ao criar operação:', error);
      throw error;
    }
  }

  /**
   * Busca operação por ID
   * @param {number} id - ID da operação
   * @returns {Promise<Object|null>} Operação encontrada ou null
   */
  async findById(id) {
    try {
      const operation = await Operation.findByPk(id, {
        include: ['user']
      });
      return operation;
    } catch (error) {
      logger.error('Erro ao buscar operação por ID:', error);
      throw error;
    }
  }

  /**
   * Lista operações com filtros e paginação
   * @param {Object} options - Opções de busca e paginação
   * @returns {Promise<Object>} Lista de operações e metadados
   */
  async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        order = [['createdAt', 'DESC']],
        where = {},
        include = ['user']
      } = options;

      const offset = (page - 1) * limit;

      const { count, rows } = await Operation.findAndCountAll({
        where,
        include,
        order,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });


      return {
        operations: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      logger.error('Erro ao listar operações:', error);
      throw error;
    }
  }

  /**
   * Lista operações por usuário
   * @param {number} userId - ID do usuário
   * @param {Object} options - Opções de busca
   * @returns {Promise<Object>} Lista de operações do usuário
   */
  async findByUserId(userId, options = {}) {
    try {
      const whereClause = { userId };
      
      // Aplicar filtros adicionais
      if (options.month) whereClause.month = options.month;
      if (options.year) whereClause.year = options.year;
      if (options.type) whereClause.type = options.type;
      if (options.fuelType) whereClause.fuelType = options.fuelType;

      return await this.findAll({
        ...options,
        where: whereClause
      });
    } catch (error) {
      logger.error('Erro ao buscar operações por usuário:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma operação
   * @param {number} id - ID da operação
   * @param {Object} updateData - Dados para atualização
   * @returns {Promise<Object|null>} Operação atualizada ou null
   */
  async update(id, updateData) {
    try {
      const [affectedRows] = await Operation.update(updateData, {
        where: { id }
      });

      if (affectedRows === 0) {
        return null;
      }

      const updatedOperation = await this.findById(id);
      return updatedOperation;
    } catch (error) {
      logger.error('Erro ao atualizar operação:', error);
      throw error;
    }
  }

  /**
   * Remove uma operação
   * @param {number} id - ID da operação
   * @returns {Promise<boolean>} True se removida com sucesso
   */
  async delete(id) {
    try {
      const deletedRows = await Operation.destroy({
        where: { id }
      });

      return deletedRows > 0;
    } catch (error) {
      logger.error('Erro ao remover operação:', error);
      throw error;
    }
  }

  /**
   * Calcula estatísticas das operações
   * @param {number} userId - ID do usuário (opcional)
   * @param {Object} filters - Filtros para cálculo
   * @returns {Promise<Object>} Estatísticas das operações
   */
  async getStatistics(userId = null, filters = {}) {
    try {
      const whereClause = {};
      
      if (userId) whereClause.userId = userId;
      if (filters.month) whereClause.month = filters.month;
      if (filters.year) whereClause.year = filters.year;
      if (filters.type) whereClause.type = filters.type;
      if (filters.fuelType) whereClause.fuelType = filters.fuelType;

      const operations = await Operation.findAll({
        where: whereClause,
        include: ['user']
      });

      const stats = {
        totalOperations: operations.length,
        totalValue: 0,
        totalQuantity: 0,
        byType: { purchase: 0, sale: 0 },
        byFuelType: { gasoline: 0, ethanol: 0, diesel: 0 },
        byMonth: {},
        averageValue: 0,
        averageQuantity: 0
      };

      let totalValue = 0;
      let totalQuantity = 0;

      operations.forEach(operation => {
        const value = parseFloat(operation.totalValue) || 0;
        const quantity = parseFloat(operation.quantity) || 0;

        stats.totalValue += value;
        stats.totalQuantity += quantity;

        // Por tipo de operação
        stats.byType[operation.type] += value;

        // Por tipo de combustível
        stats.byFuelType[operation.fuelType] += value;

        // Por mês
        if (!stats.byMonth[operation.month]) {
          stats.byMonth[operation.month] = {
            value: 0,
            quantity: 0,
            operations: 0
          };
        }
        stats.byMonth[operation.month].value += value;
        stats.byMonth[operation.month].quantity += quantity;
        stats.byMonth[operation.month].operations += 1;
      });

      // Calcular médias
      stats.averageValue = operations.length > 0 ? stats.totalValue / operations.length : 0;
      stats.averageQuantity = operations.length > 0 ? stats.totalQuantity / operations.length : 0;

      // Arredondar valores
      stats.totalValue = Math.round(stats.totalValue * 100) / 100;
      stats.totalQuantity = Math.round(stats.totalQuantity * 100) / 100;
      stats.averageValue = Math.round(stats.averageValue * 100) / 100;
      stats.averageQuantity = Math.round(stats.averageQuantity * 100) / 100;

      Object.keys(stats.byType).forEach(type => {
        stats.byType[type] = Math.round(stats.byType[type] * 100) / 100;
      });

      Object.keys(stats.byFuelType).forEach(fuelType => {
        stats.byFuelType[fuelType] = Math.round(stats.byFuelType[fuelType] * 100) / 100;
      });

      Object.keys(stats.byMonth).forEach(month => {
        stats.byMonth[month].value = Math.round(stats.byMonth[month].value * 100) / 100;
        stats.byMonth[month].quantity = Math.round(stats.byMonth[month].quantity * 100) / 100;
      });

      return stats;
    } catch (error) {
      logger.error('Erro ao calcular estatísticas das operações:', error);
      throw error;
    }
  }

  /**
   * Calcula diferença entre compras e vendas
   * @param {number} userId - ID do usuário (opcional)
   * @param {Object} filters - Filtros para cálculo
   * @returns {Promise<Object>} Diferença entre compras e vendas
   */
  async calculatePurchaseSaleDifference(userId = null, filters = {}) {
    try {
      const whereClause = {};
      
      if (userId) whereClause.userId = userId;
      if (filters.month) whereClause.month = filters.month;
      if (filters.year) whereClause.year = filters.year;
      if (filters.fuelType) whereClause.fuelType = filters.fuelType;

      const operations = await Operation.findAll({
        where: whereClause
      });

      let totalPurchases = 0;
      let totalSales = 0;

      operations.forEach(operation => {
        const value = parseFloat(operation.totalValue) || 0;
        
        if (operation.type === 'purchase') {
          totalPurchases += value;
        } else if (operation.type === 'sale') {
          totalSales += value;
        }
      });

      const difference = totalSales - totalPurchases;

      return {
        totalPurchases: Math.round(totalPurchases * 100) / 100,
        totalSales: Math.round(totalSales * 100) / 100,
        difference: Math.round(difference * 100) / 100,
        isPositive: difference >= 0,
        operationsCount: operations.length
      };
    } catch (error) {
      logger.error('Erro ao calcular diferença compras/vendas:', error);
      throw error;
    }
  }
}

module.exports = new OperationRepository();

