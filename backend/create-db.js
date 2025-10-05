const mysql = require('mysql2/promise');
const config = require('./src/config/config');

async function createDatabase() {
  const dbConfig = config.development;
  
  // Conectar sem especificar o banco de dados
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.username,
    password: dbConfig.password
  });

  try {
    // Criar o banco de dados se não existir
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(` Banco de dados '${dbConfig.database}' criado/verificado com sucesso!`);
  } catch (error) {
    console.error(' Erro ao criar banco de dados:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createDatabase();
}

module.exports = createDatabase;
