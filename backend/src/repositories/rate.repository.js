const { Rate } = require('../database/models');
const logger = require('../config/logger');

class RateRepository {
  /**
   * Busca taxa por mês, ano, tipo de combustível e tipo de operação
   * @param {number} month - Mês
   * @param {number} year - Ano
   * @param {string} fuelType - Tipo do combustível
   * @param {string} operationType - Tipo da operação
   * @returns {Promise<Object|null>} Taxa encontrada ou null
   */
  async findByMonthAndFuel(month, year, fuelType, operationType) {
    try {
      const rate = await Rate.findOne({
        where: {
          month,
          year,
          fuelType,
          operationType
        }
      });

      return rate;
    } catch (error) {
      logger.error('Erro ao buscar taxa:', error);
      throw error;
    }
  }

  /**
   * Lista todas as taxas com filtros opcionais
   * @param {Object} filters - Filtros para busca
   * @returns {Promise<Array>} Lista de taxas
   */
  async findAll(filters = {}) {
    try {
      const whereClause = {};
      
      if (filters.month) whereClause.month = filters.month;
      if (filters.year) whereClause.year = filters.year;
      if (filters.fuelType) whereClause.fuelType = filters.fuelType;
      if (filters.operationType) whereClause.operationType = filters.operationType;

      const rates = await Rate.findAll({
        where: whereClause,
        order: [['year', 'DESC'], ['month', 'DESC']]
      });

      return rates;
    } catch (error) {
      logger.error('Erro ao listar taxas:', error);
      throw error;
    }
  }

  /**
   * Busca taxas por ano
   * @param {number} year - Ano
   * @returns {Promise<Array>} Lista de taxas do ano
   */
  async findByYear(year) {
    try {
      const rates = await Rate.findAll({
        where: { year },
        order: [['month', 'ASC']]
      });

      return rates;
    } catch (error) {
      logger.error('Erro ao buscar taxas por ano:', error);
      throw error;
    }
  }

  /**
   * Busca taxas por tipo de combustível
   * @param {string} fuelType - Tipo do combustível
   * @param {number} year - Ano (opcional)
   * @returns {Promise<Array>} Lista de taxas
   */
  async findByFuelType(fuelType, year = null) {
    try {
      const whereClause = { fuelType };
      if (year) whereClause.year = year;

      const rates = await Rate.findAll({
        where: whereClause,
        order: [['year', 'DESC'], ['month', 'DESC']]
      });

      return rates;
    } catch (error) {
      logger.error('Erro ao buscar taxas por tipo de combustível:', error);
      throw error;
    }
  }

  /**
   * Cria uma nova taxa
   * @param {Object} rateData - Dados da taxa
   * @returns {Promise<Object>} Taxa criada
   */
  async create(rateData) {
    try {
      const rate = await Rate.create(rateData);
      return rate;
    } catch (error) {
      logger.error('Erro ao criar taxa:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma taxa
   * @param {number} id - ID da taxa
   * @param {Object} updateData - Dados para atualização
   * @returns {Promise<Object|null>} Taxa atualizada ou null
   */
  async update(id, updateData) {
    try {
      const [affectedRows] = await Rate.update(updateData, {
        where: { id }
      });

      if (affectedRows === 0) {
        return null;
      }

      const updatedRate = await Rate.findByPk(id);
      return updatedRate;
    } catch (error) {
      logger.error('Erro ao atualizar taxa:', error);
      throw error;
    }
  }

  /**
   * Remove uma taxa
   * @param {number} id - ID da taxa
   * @returns {Promise<boolean>} True se removida com sucesso
   */
  async delete(id) {
    try {
      const deletedRows = await Rate.destroy({
        where: { id }
      });

      return deletedRows > 0;
    } catch (error) {
      logger.error('Erro ao remover taxa:', error);
      throw error;
    }
  }

  /**
   * Busca estatísticas das taxas
   * @param {number} year - Ano
   * @returns {Promise<Object>} Estatísticas das taxas
   */
  async getStatistics(year = 2024) {
    try {
      const rates = await this.findByYear(year);
      
      const stats = {
        totalRates: rates.length,
        byFuelType: {},
        byOperationType: {},
        averageTaxRate: 0,
        averageUnitPrice: 0
      };

      let totalTaxRate = 0;
      let totalUnitPrice = 0;

      rates.forEach(rate => {
        // Por tipo de combustível
        if (!stats.byFuelType[rate.fuelType]) {
          stats.byFuelType[rate.fuelType] = {
            count: 0,
            averagePrice: 0,
            averageTaxRate: 0,
            totalPrice: 0,
            totalTaxRate: 0
          };
        }
        
        stats.byFuelType[rate.fuelType].count++;
        stats.byFuelType[rate.fuelType].totalPrice += parseFloat(rate.unitPrice);
        stats.byFuelType[rate.fuelType].totalTaxRate += parseFloat(rate.taxRate);

        // Por tipo de operação
        if (!stats.byOperationType[rate.operationType]) {
          stats.byOperationType[rate.operationType] = {
            count: 0,
            averagePrice: 0,
            averageTaxRate: 0,
            totalPrice: 0,
            totalTaxRate: 0
          };
        }
        
        stats.byOperationType[rate.operationType].count++;
        stats.byOperationType[rate.operationType].totalPrice += parseFloat(rate.unitPrice);
        stats.byOperationType[rate.operationType].totalTaxRate += parseFloat(rate.taxRate);

        totalTaxRate += parseFloat(rate.taxRate);
        totalUnitPrice += parseFloat(rate.unitPrice);
      });

      // Calcular médias
      stats.averageTaxRate = rates.length > 0 ? totalTaxRate / rates.length : 0;
      stats.averageUnitPrice = rates.length > 0 ? totalUnitPrice / rates.length : 0;

      // Calcular médias por categoria
      Object.keys(stats.byFuelType).forEach(fuelType => {
        const data = stats.byFuelType[fuelType];
        data.averagePrice = data.count > 0 ? data.totalPrice / data.count : 0;
        data.averageTaxRate = data.count > 0 ? data.totalTaxRate / data.count : 0;
      });

      Object.keys(stats.byOperationType).forEach(operationType => {
        const data = stats.byOperationType[operationType];
        data.averagePrice = data.count > 0 ? data.totalPrice / data.count : 0;
        data.averageTaxRate = data.count > 0 ? data.totalTaxRate / data.count : 0;
      });

      return stats;
    } catch (error) {
      logger.error('Erro ao calcular estatísticas das taxas:', error);
      throw error;
    }
  }
}

module.exports = new RateRepository();

