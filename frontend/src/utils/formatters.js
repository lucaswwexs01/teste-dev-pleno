/**
 * Formata um valor monetário para exibição em reais
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado em reais
 */
export const formatCurrency = (value) => {
  // Converter para número se for string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (typeof numValue !== 'number' || isNaN(numValue)) {
    console.warn('Valor inválido para formatação:', value, typeof value);
    return 'R$ 0,00';
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numValue);
};

/**
 * Formata uma quantidade para exibição com unidade
 * @param {number} quantity - Quantidade a ser formatada
 * @returns {string} Quantidade formatada com unidade
 */
export const formatQuantity = (quantity) => {
  if (typeof quantity !== 'number') return '0,000 L';
  
  return `${quantity.toFixed(3).replace('.', ',')} L`;
};

/**
 * Formata uma porcentagem para exibição
 * @param {number} value - Valor a ser formatado
 * @returns {string} Porcentagem formatada
 */
export const formatPercentage = (value) => {
  if (typeof value !== 'number') return '0,00%';
  
  return `${value.toFixed(2).replace('.', ',')}%`;
};

/**
 * Obtém o nome do mês em português
 * @param {number} month - Número do mês (1-12)
 * @returns {string} Nome do mês
 */
export const getMonthName = (month) => {
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
export const getFuelTypeName = (fuelType) => {
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
export const getOperationTypeName = (operationType) => {
  const operationTypes = {
    'purchase': 'Compra',
    'sale': 'Venda'
  };
  return operationTypes[operationType] || operationType;
};

/**
 * Obtém a cor do tipo de operação
 * @param {string} operationType - Tipo da operação
 * @returns {string} Cor em hexadecimal
 */
export const getOperationTypeColor = (operationType) => {
  const colors = {
    'purchase': '#f44336', // Vermelho
    'sale': '#4caf50'      // Verde
  };
  return colors[operationType] || '#666';
};

/**
 * Obtém a cor do tipo de combustível
 * @param {string} fuelType - Tipo do combustível
 * @returns {string} Cor em hexadecimal
 */
export const getFuelTypeColor = (fuelType) => {
  const colors = {
    'gasoline': '#ff9800', // Laranja
    'ethanol': '#8bc34a',  // Verde claro
    'diesel': '#2196f3'     // Azul
  };
  return colors[fuelType] || '#666';
};

/**
 * Valida formato de email
 * @param {string} email - Email a ser validado
 * @returns {boolean} True se email é válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida força da senha
 * @param {string} password - Senha a ser validada
 * @returns {Object} Resultado da validação
 */
export const validatePasswordStrength = (password) => {
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
 * Formata data para exibição
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} Data formatada
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Formata data para input de data
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} Data formatada para input
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  return dateObj.toISOString().split('T')[0];
};

/**
 * Calcula diferença em dias entre duas datas
 * @param {string|Date} date1 - Primeira data
 * @param {string|Date} date2 - Segunda data
 * @returns {number} Diferença em dias
 */
export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Debounce function para otimizar chamadas de API
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} Função com debounce
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Gera cores aleatórias para gráficos
 * @param {number} count - Número de cores necessárias
 * @returns {Array} Array de cores em hexadecimal
 */
export const generateColors = (count) => {
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
  ];
  
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  
  return result;
};

/**
 * Trunca texto se exceder o limite
 * @param {string} text - Texto a ser truncado
 * @param {number} maxLength - Comprimento máximo
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitaliza primeira letra de cada palavra
 * @param {string} text - Texto a ser capitalizado
 * @returns {string} Texto capitalizado
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  return text.replace(/\b\w/g, l => l.toUpperCase());
};

