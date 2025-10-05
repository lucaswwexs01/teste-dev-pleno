const app = require('./app');
const { sequelize } = require('./database/models');
const logger = require('./config/logger');

const PORT = process.env.PORT || 3001;

// Função para inicializar o servidor
const startServer = async () => {
  try {
    // Testar conexão com o banco de dados
    await sequelize.authenticate();

    // Sincronizar modelos (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    logger.error('Erro ao inicializar o servidor:', error);
    process.exit(1);
  }
};

// Tratamento de sinais de encerramento
process.on('SIGTERM', async () => {
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await sequelize.close();
  process.exit(0);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  logger.error('Erro não capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promise rejeitada não tratada:', reason);
  process.exit(1);
});

// Inicializar servidor
startServer();

