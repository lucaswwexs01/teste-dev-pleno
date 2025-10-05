const operationRepository = require('../repositories/operation.repository');
const rateRepository = require('../repositories/rate.repository');
const { calculateTotalValue } = require('../utils/calc.utils');
const logger = require('../config/logger');

class OperationService {
  /**
   * Cria uma nova operação
   */
  async createOperation(operationData, userId) {
    try {
      const { type, fuelType, quantity, month, year = 2024 } = operationData;

      const rate = await rateRepository.findByMonthAndFuel(month, year, fuelType, type);
      if (!rate) {
        logger.error('Taxa não encontrada:', { month, year, fuelType, type });
        
        if (year !== 2024) {
          throw new Error('Apenas dados do ano de 2024 estão disponíveis');
        }
        
        throw new Error(`Taxa não encontrada para ${fuelType} em ${month}/${year} do tipo ${type}`);
      }


      const totalValue = calculateTotalValue(
        quantity,
        rate.unitPrice,
        rate.taxRate,
        11.5 // Taxa SELIC fixa
      );


      const operation = await operationRepository.create({
        type,
        fuelType,
        quantity,
        month,
        year,
        unitPrice: rate.unitPrice,
        taxRate: rate.taxRate,
        selicRate: 11.5,
        totalValue,
        userId
      });


      return operation;
    } catch (error) {
      logger.error('Erro ao criar operação:', error);
      throw error;
    }
  }

  /**
   * Lista operações com filtros
   * @param {Object} filters - Filtros para busca
   * @param {number} userId - ID do usuário (opcional)
   * @returns {Promise<Object>} Lista de operações
   */
  async listOperations(filters = {}, userId = null) {
    try {
      const validatedFilters = { ...filters, year: 2024 };

      
      const options = {
        page: validatedFilters.page || 1,
        limit: validatedFilters.limit || 10,
        order: [['createdAt', 'DESC']]
      };

      let result;
      if (userId) {
        result = await operationRepository.findByUserId(userId, { ...options, ...validatedFilters });
      } else {
        result = await operationRepository.findAll({ ...options, ...validatedFilters });
      }


      return result;
    } catch (error) {
      logger.error('Erro ao listar operações:', error);
      throw error;
    }
  }

  /**
   * Busca operação por ID
   * @param {number} operationId - ID da operação
   * @param {number} userId - ID do usuário (opcional para verificação de propriedade)
   * @returns {Promise<Object>} Operação encontrada
   */
  async getOperationById(operationId, userId = null) {
    try {
      const operation = await operationRepository.findById(operationId);
      if (!operation) {
        throw new Error('Operação não encontrada');
      }

      // Verificar se o usuário tem permissão para ver esta operação
      if (userId && operation.userId !== userId) {
        throw new Error('Acesso negado a esta operação');
      }

      return operation;
    } catch (error) {
      logger.error('Erro ao buscar operação:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma operação
   * @param {number} operationId - ID da operação
   * @param {Object} updateData - Dados para atualização
   * @param {number} userId - ID do usuário
   * @returns {Promise<Object>} Operação atualizada
   */
  async updateOperation(operationId, updateData, userId) {
    try {
      // Verificar se a operação existe e pertence ao usuário
      const existingOperation = await this.getOperationById(operationId, userId);

      const { type, fuelType, quantity, month, year = 2024 } = updateData;

      // Buscar nova taxa se necessário
      let rate = null;
      if (type || fuelType || month || year) {
        const searchType = type || existingOperation.type;
        const searchFuelType = fuelType || existingOperation.fuelType;
        const searchMonth = month || existingOperation.month;
        const searchYear = year || existingOperation.year;

        rate = await rateRepository.findByMonthAndFuel(searchMonth, searchYear, searchFuelType, searchType);
        if (!rate) {
          throw new Error(`Taxa não encontrada para ${searchFuelType} em ${searchMonth}/${searchYear} do tipo ${searchType}`);
        }
      }

      // Preparar dados para atualização
      const updateFields = { ...updateData };
      
      if (rate) {
        updateFields.unitPrice = rate.unitPrice;
        updateFields.taxRate = rate.taxRate;
      }

      // Recalcular valor total se necessário
      if (quantity || rate) {
        const finalQuantity = quantity || existingOperation.quantity;
        const finalUnitPrice = rate ? rate.unitPrice : existingOperation.unitPrice;
        const finalTaxRate = rate ? rate.taxRate : existingOperation.taxRate;

        updateFields.totalValue = calculateTotalValue(
          finalQuantity,
          finalUnitPrice,
          finalTaxRate,
          11.5
        );
      }

      const updatedOperation = await operationRepository.update(operationId, updateFields);
      if (!updatedOperation) {
        throw new Error('Erro ao atualizar operação');
      }


      return updatedOperation;
    } catch (error) {
      logger.error('Erro ao atualizar operação:', error);
      throw error;
    }
  }

  /**
   * Remove uma operação
   * @param {number} operationId - ID da operação
   * @param {number} userId - ID do usuário
   * @returns {Promise<boolean>} True se removida com sucesso
   */
  async deleteOperation(operationId, userId) {
    try {
      // Verificar se a operação existe e pertence ao usuário
      await this.getOperationById(operationId, userId);

      const deleted = await operationRepository.delete(operationId);
      if (!deleted) {
        throw new Error('Erro ao remover operação');
      }

      return true;
    } catch (error) {
      logger.error('Erro ao remover operação:', error);
      throw error;
    }
  }

  /**
   * Calcula estatísticas das operações
   * @param {Object} filters - Filtros para cálculo
   * @param {number} userId - ID do usuário (opcional)
   * @returns {Promise<Object>} Estatísticas das operações
   */
  async getStatistics(filters = {}, userId = null) {
    try {
      return await operationRepository.getStatistics(userId, filters);
    } catch (error) {
      logger.error('Erro ao calcular estatísticas:', error);
      throw error;
    }
  }

  /**
   * Calcula diferença entre compras e vendas
   * @param {Object} filters - Filtros para cálculo
   * @param {number} userId - ID do usuário (opcional)
   * @returns {Promise<Object>} Diferença entre compras e vendas
   */
  async calculatePurchaseSaleDifference(filters = {}, userId = null) {
    try {
      return await operationRepository.calculatePurchaseSaleDifference(userId, filters);
    } catch (error) {
      logger.error('Erro ao calcular diferença compras/vendas:', error);
      throw error;
    }
  }

  /**
   * Gera relatório de operações
   * @param {Object} filters - Filtros para o relatório
   * @param {number} userId - ID do usuário (opcional)
   * @returns {Promise<Object>} Relatório completo
   */
  async generateReport(filters = {}, userId = null) {
    try {
      const validatedFilters = { ...filters, year: 2024 };


      const [operations, statistics, difference] = await Promise.all([
        this.listOperations(validatedFilters, userId),
        this.getStatistics(validatedFilters, userId),
        this.calculatePurchaseSaleDifference(validatedFilters, userId)
      ]);

      const result = {
        operations: operations.operations,
        pagination: operations.pagination,
        statistics,
        purchaseSaleDifference: difference,
        filters: validatedFilters,
        generatedAt: new Date()
      };


      return result;
    } catch (error) {
      logger.error('Erro ao gerar relatório:', error);
      throw error;
    }
  }

  /**
   * Valida dados de operação
   * @param {Object} operationData - Dados da operação
   * @returns {Object} Resultado da validação
   */
  validateOperationData(operationData) {
    const errors = [];

    if (!operationData.type || !['purchase', 'sale'].includes(operationData.type)) {
      errors.push('Tipo deve ser "purchase" ou "sale"');
    }

    if (!operationData.fuelType || !['gasoline', 'ethanol', 'diesel'].includes(operationData.fuelType)) {
      errors.push('Tipo de combustível deve ser "gasoline", "ethanol" ou "diesel"');
    }

    if (!operationData.quantity || operationData.quantity <= 0) {
      errors.push('Quantidade deve ser maior que zero');
    }

    if (!operationData.month || operationData.month < 1 || operationData.month > 12) {
      errors.push('Mês deve ser um número entre 1 e 12');
    }

    if (operationData.year && (operationData.year < 2020 || operationData.year > new Date().getFullYear())) {
      errors.push('Ano deve ser válido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Calcula preview de uma operação sem salvá-la
   * @param {Object} operationData - Dados da operação
   * @returns {Promise<Object>} Preview da operação
   */
  async calculatePreview(operationData) {
    try {
      const { type, fuelType, quantity, month, year = 2024 } = operationData;

      const rate = await rateRepository.findByMonthAndFuel(month, year, fuelType, type);
      if (!rate) {
        if (year !== 2024) {
          throw new Error('Apenas dados do ano de 2024 estão disponíveis');
        }
        throw new Error(`Taxa não encontrada para ${fuelType} em ${month}/${year} do tipo ${type}`);
      }

      const totalValue = calculateTotalValue(
        quantity,
        rate.unitPrice,
        rate.taxRate,
        11.5
      );

      return {
        quantity,
        unitPrice: rate.unitPrice,
        taxRate: rate.taxRate,
        selicRate: 11.5,
        totalValue,
        fuelType,
        type,
        month,
        year
      };
    } catch (error) {
      logger.error('Erro ao calcular preview:', error);
      throw error;
    }
  }
}

module.exports = new OperationService();

