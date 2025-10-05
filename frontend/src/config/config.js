// Configurações da aplicação
export const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  ENV: process.env.REACT_APP_ENV || 'development'
};

export default config;
