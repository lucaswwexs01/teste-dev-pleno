'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('operations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM('purchase', 'sale'),
        allowNull: false
      },
      fuel_type: {
        type: Sequelize.ENUM('gasoline', 'ethanol', 'diesel'),
        allowNull: false
      },
      quantity: {
        type: Sequelize.DECIMAL(10, 3),
        allowNull: false
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
      unit_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      tax_rate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      selic_rate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 11.5
      },
      total_value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    await queryInterface.addIndex('operations', ['user_id'], {
      name: 'operations_user_id_index'
    });

    await queryInterface.addIndex('operations', ['type', 'fuel_type'], {
      name: 'operations_type_fuel_index'
    });

    await queryInterface.addIndex('operations', ['month', 'year'], {
      name: 'operations_month_year_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('operations');
  }
};

