const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Operation = sequelize.define('Operation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM('purchase', 'sale'),
      allowNull: false
    },
    fuelType: {
      type: DataTypes.ENUM('gasoline', 'ethanol', 'diesel'),
      allowNull: false,
      field: 'fuel_type'
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      validate: {
        min: 0.001
      }
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
    selicRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 11.5,
      field: 'selic_rate'
    },
    totalValue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'total_value'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
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
    tableName: 'operations',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['type', 'fuel_type']
      },
      {
        fields: ['month', 'year']
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
                instance.dataValues.selicRate = parseFloat(instance.dataValues.selicRate) || 0;
                instance.dataValues.totalValue = parseFloat(instance.dataValues.totalValue) || 0;
                instance.dataValues.quantity = parseFloat(instance.dataValues.quantity) || 0;
              }
            });
          } else if (instances.dataValues) {
            instance.dataValues.unitPrice = parseFloat(instances.dataValues.unitPrice) || 0;
            instance.dataValues.taxRate = parseFloat(instances.dataValues.taxRate) || 0;
            instance.dataValues.selicRate = parseFloat(instances.dataValues.selicRate) || 0;
            instance.dataValues.totalValue = parseFloat(instances.dataValues.totalValue) || 0;
            instance.dataValues.quantity = parseFloat(instances.dataValues.quantity) || 0;
          }
        }
      }
    }
  });

  Operation.associate = (models) => {
    Operation.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Operation;
};

