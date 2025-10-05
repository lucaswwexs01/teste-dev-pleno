import React, { createContext, useContext, useState, useEffect } from 'react';
import { configService } from '../services/api';

const ConfigContext = createContext();

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig deve ser usado dentro de um ConfigProvider');
  }
  return context;
};

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    fuelTypes: [],
    operationTypes: [],
    months: [],
    years: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await configService.getAllConfig();
      setConfig(response.data);
    } catch (error) {
      setError('Erro ao carregar configurações');
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFuelTypeLabel = (value) => {
    const fuelType = config.fuelTypes.find(ft => ft.value === value);
    return fuelType ? fuelType.label : value;
  };

  const getFuelTypeColor = (value) => {
    const fuelType = config.fuelTypes.find(ft => ft.value === value);
    return fuelType ? fuelType.color : '#666';
  };

  const getOperationTypeLabel = (value) => {
    const operationType = config.operationTypes.find(ot => ot.value === value);
    return operationType ? operationType.label : value;
  };

  const getOperationTypeColor = (value) => {
    const operationType = config.operationTypes.find(ot => ot.value === value);
    return operationType ? operationType.color : '#666';
  };

  const getMonthLabel = (value) => {
    const month = config.months.find(m => m.value === value);
    return month ? month.label : 'Mês inválido';
  };

  const value = {
    config,
    loading,
    error,
    loadConfig,
    getFuelTypeLabel,
    getFuelTypeColor,
    getOperationTypeLabel,
    getOperationTypeColor,
    getMonthLabel
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};
