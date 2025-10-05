const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Rate = sequelize.define('Rate', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12
      }
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2024
    },
    fuelType: {
      type: DataTypes.ENUM('gasoline', 'ethanol', 'diesel'),
      allowNull: false,
      field: 'fuel_type'
    },
    operationType: {
      type: DataTypes.ENUM('purchase', 'sale'),
      allowNull: false,
      field: 'operation_type'
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'unit_price'
    },
    taxRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      field: 'tax_rate'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    }
  }, {
    tableName: 'rates',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['month', 'year', 'fuel_type', 'operation_type']
      }
    ],
    hooks: {
      afterFind: (instances) => {
        if (instances) {
          if (Array.isArray(instances)) {
            instances.forEach(instance => {
              if (instance.dataValues) {
                instance.dataValues.unitPrice = parseFloat(instance.dataValues.unitPrice) || 0;
                instance.dataValues.taxRate = parseFloat(instance.dataValues.taxRate) || 0;
              }
            });
          } else if (instances.dataValues) {
            instances.dataValues.unitPrice = parseFloat(instances.dataValues.unitPrice) || 0;
            instances.dataValues.taxRate = parseFloat(instances.dataValues.taxRate) || 0;
          }
        }
      }
    }
  });

  return Rate;
};

