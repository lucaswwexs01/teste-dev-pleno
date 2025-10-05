 /**
 * Calcula o valor unitário atualizado com base na fórmula:
 * Valor Unitário Atualizado = Quantidade × Preço × Tributo × SELIC
 * 
 * @param {number} quantity - Quantidade em litros
 * @param {number} unitPrice - Preço unitário do combustível
 * @param {number} taxRate - Taxa de tributo (em percentual)
 * @param {number} selicRate - Taxa SELIC (em percentual, padrão 11.5%)
 * @returns {number} Valor total calculado
 */
const calculateTotalValue = (quantity, unitPrice, taxRate, selicRate = 11.5) => {
  // Converter percentuais para decimais
  const taxMultiplier = 1 + (taxRate / 100);
  const selicMultiplier = 1 + (selicRate / 100);
  
  // Aplicar a fórmula: Quantidade × Preço × Tributo × SELIC
  const totalValue = quantity * unitPrice * taxMultiplier * selicMultiplier;
  
  // Arredondar para 2 casas decimais
  return Math.round(totalValue * 100) / 100;
};

/**
 * Calcula a diferença entre compras e vendas
 * @param {Array} operations - Array de operações
 * @returns {Object} Objeto com totais e diferença
 */
const calculatePurchaseSaleDifference = (operations) => {
  let totalPurchases = 0;
  let totalSales = 0;
  
  operations.forEach(operation => {
    if (operation.type === 'purchase') {
      totalPurchases += parseFloat(operation.totalValue);
    } else if (operation.type === 'sale') {
      totalSales += parseFloat(operation.totalValue);
    }
  });
  
  const difference = totalSales - totalPurchases;
  
  return {
    totalPurchases: Math.round(totalPurchases * 100) / 100,
    totalSales: Math.round(totalSales * 100) / 100,
    difference: Math.round(difference * 100) / 100,
    isPositive: difference >= 0
  };
};

/**
 * Valida se um mês é válido
 * @param {number} month - Mês a ser validado
 * @returns {boolean} True se válido
 */
const isValidMonth = (month) => {
  return month >= 1 && month <= 12;
};

/**
 * Valida se um ano é válido
 * @param {number} year - Ano a ser validado
 * @returns {boolean} True se válido
 */
const isValidYear = (year) => {
  const currentYear = new Date().getFullYear();
  return year >= 2020 && year <= currentYear;
};

/**
 * Valida se uma quantidade é válida
 * @param {number} quantity - Quantidade a ser validada
 * @returns {boolean} True se válida
 */
const isValidQuantity = (quantity) => {
  return quantity > 0 && quantity <= 1000000; // Máximo de 1 milhão de litros
};

/**
 * Formata um valor monetário para exibição
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado em reais
 */
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formata uma quantidade para exibição
 * @param {number} quantity - Quantidade a ser formatada
 * @returns {string} Quantidade formatada com unidade
 */
const formatQuantity = (quantity) => {
  return `${quantity.toFixed(3)} L`;
};

/**
 * Obtém o nome do mês em português
 * @param {number} month - Número do mês (1-12)
 * @returns {string} Nome do mês
 */
const getMonthName = (month) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[month - 1] || 'Mês inválido';
};

/**
 * Obtém o nome do tipo de combustível em português
 * @param {string} fuelType - Tipo do combustível
 * @returns {string} Nome do combustível
 */
const getFuelTypeName = (fuelType) => {
  const fuelTypes = {
    'gasoline': 'Gasolina',
    'ethanol': 'Etanol',
    'diesel': 'Diesel'
  };
  return fuelTypes[fuelType] || fuelType;
};

/**
 * Obtém o nome do tipo de operação em português
 * @param {string} operationType - Tipo da operação
 * @returns {string} Nome da operação
 */
const getOperationTypeName = (operationType) => {
  const operationTypes = {
    'purchase': 'Compra',
    'sale': 'Venda'
  };
  return operationTypes[operationType] || operationType;
};

module.exports = {
  calculateTotalValue,
  calculatePurchaseSaleDifference,
  isValidMonth,
  isValidYear,
  isValidQuantity,
  formatCurrency,
  formatQuantity,
  getMonthName,
  getFuelTypeName,
  getOperationTypeName
};

