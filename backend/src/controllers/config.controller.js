const { asyncHandler } = require('../middlewares/error.middleware');

const getFuelTypes = asyncHandler(async (req, res) => {
  const fuelTypes = [
    { value: 'gasoline', label: 'Gasolina', color: '#ff9800' },
    { value: 'ethanol', label: 'Etanol', color: '#8bc34a' },
    { value: 'diesel', label: 'Diesel', color: '#2196f3' }
  ];

  res.json({
    message: 'Tipos de combustível obtidos com sucesso',
    data: fuelTypes
  });
});

const getOperationTypes = asyncHandler(async (req, res) => {
  const operationTypes = [
    { value: 'purchase', label: 'Compra', color: '#f44336' },
    { value: 'sale', label: 'Venda', color: '#4caf50' }
  ];

  res.json({
    message: 'Tipos de operação obtidos com sucesso',
    data: operationTypes
  });
});

const getMonths = asyncHandler(async (req, res) => {
  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  res.json({
    message: 'Meses obtidos com sucesso',
    data: months
  });
});

const getYears = asyncHandler(async (req, res) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  
  for (let year = currentYear - 2; year <= currentYear + 1; year++) {
    years.push({ value: year, label: year.toString() });
  }

  res.json({
    message: 'Anos obtidos com sucesso',
    data: years
  });
});

const getAllConfig = asyncHandler(async (req, res) => {
  const fuelTypes = [
    { value: 'gasoline', label: 'Gasolina', color: '#ff9800' },
    { value: 'ethanol', label: 'Etanol', color: '#8bc34a' },
    { value: 'diesel', label: 'Diesel', color: '#2196f3' }
  ];

  const operationTypes = [
    { value: 'purchase', label: 'Compra', color: '#f44336' },
    { value: 'sale', label: 'Venda', color: '#4caf50' }
  ];

  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  const currentYear = new Date().getFullYear();
  const years = [];
  
  for (let year = currentYear - 2; year <= currentYear + 1; year++) {
    years.push({ value: year, label: year.toString() });
  }

  res.json({
    message: 'Configurações obtidas com sucesso',
    data: {
      fuelTypes,
      operationTypes,
      months,
      years
    }
  });
});

module.exports = {
  getFuelTypes,
  getOperationTypes,
  getMonths,
  getYears,
  getAllConfig
};
