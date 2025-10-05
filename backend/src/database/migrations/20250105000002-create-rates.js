'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      month: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2024
      },
      fuel_type: {
        type: Sequelize.ENUM('gasoline', 'ethanol', 'diesel'),
        allowNull: false
      },
      operation_type: {
        type: Sequelize.ENUM('purchase', 'sale'),
        allowNull: false
      },
      unit_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      tax_rate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('rates', ['month', 'year', 'fuel_type', 'operation_type'], {
      unique: true,
      name: 'rates_unique_constraint'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rates');
  }
};

