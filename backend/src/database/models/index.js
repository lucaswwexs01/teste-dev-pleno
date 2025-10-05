const { Sequelize } = require('sequelize');
const config = require('../../config/config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Importar modelos
const User = require('./user')(sequelize);
const Rate = require('./rate')(sequelize);
const Operation = require('./operation')(sequelize);

// Definir associações
Object.keys(sequelize.models).forEach(modelName => {
  if (sequelize.models[modelName].associate) {
    sequelize.models[modelName].associate(sequelize.models);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  User,
  Rate,
  Operation
};

