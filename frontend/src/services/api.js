import axios from 'axios';
import config from '../config/config';

const API_BASE_URL = config.API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Só redirecionar se não estiver já na página de login
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  // Registrar usuário
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Obter perfil
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Atualizar perfil
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  // Listar usuários (admin)
  listUsers: async (params = {}) => {
    const response = await api.get('/auth/users', { params });
    return response.data;
  },

  // Obter usuário por ID
  getUserById: async (id) => {
    const response = await api.get(`/auth/users/${id}`);
    return response.data;
  },

  // Desativar usuário
  deactivateUser: async (id) => {
    const response = await api.patch(`/auth/users/${id}/deactivate`);
    return response.data;
  },

  // Reativar usuário
  activateUser: async (id) => {
    const response = await api.patch(`/auth/users/${id}/activate`);
    return response.data;
  },
};

// Serviços de operações
export const operationService = {
  // Criar operação
  createOperation: async (operationData) => {
    const response = await api.post('/operations', operationData);
    return response.data;
  },

  // Listar operações
  listOperations: async (params = {}) => {
    const response = await api.get('/operations', { params });
    return response.data;
  },

  // Obter operação por ID
  getOperationById: async (id) => {
    const response = await api.get(`/operations/${id}`);
    return response.data;
  },

  // Atualizar operação
  updateOperation: async (id, operationData) => {
    const response = await api.put(`/operations/${id}`, operationData);
    return response.data;
  },

  // Remover operação
  deleteOperation: async (id) => {
    const response = await api.delete(`/operations/${id}`);
    return response.data;
  },

  // Obter estatísticas
  getStatistics: async (params = {}) => {
    const response = await api.get('/operations/statistics', { params });
    return response.data;
  },

  // Calcular diferença compras/vendas
  getPurchaseSaleDifference: async (params = {}) => {
    const response = await api.get('/operations/difference', { params });
    return response.data;
  },

  // Gerar relatório
  generateReport: async (params = {}) => {
    const response = await api.get('/operations/report', { params });
    return response.data;
  },

  // Calcular preview de operação
  calculatePreview: async (operationData) => {
    const response = await api.post('/operations/preview', operationData);
    return response.data;
  },
};

// Serviço de configuração
export const configService = {
  // Obter todos os dados de configuração
  getAllConfig: async () => {
    const response = await api.get('/config/all');
    return response.data;
  },

  // Obter tipos de combustível
  getFuelTypes: async () => {
    const response = await api.get('/config/fuel-types');
    return response.data;
  },

  // Obter tipos de operação
  getOperationTypes: async () => {
    const response = await api.get('/config/operation-types');
    return response.data;
  },

  // Obter meses
  getMonths: async () => {
    const response = await api.get('/config/months');
    return response.data;
  },

  // Obter anos
  getYears: async () => {
    const response = await api.get('/config/years');
    return response.data;
  }
};

// Serviço de health check
export const healthService = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;

