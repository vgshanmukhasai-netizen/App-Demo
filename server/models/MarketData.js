const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');

class MarketData extends Model {}

MarketData.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    cropName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { msg: 'Crop name is required' } },
    },
    pricePerKg: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    demandLevel: {
      type: DataTypes.ENUM('Low', 'Medium', 'High'),
      defaultValue: 'Medium',
    },
    priceTrend: {
      type: DataTypes.ENUM('Rising', 'Stable', 'Falling'),
      defaultValue: 'Stable',
    },
    market: {
      type: DataTypes.STRING(150),
      defaultValue: 'Local Market',
    },
    state: {
      type: DataTypes.STRING(100),
      defaultValue: 'Andhra Pradesh',
    },
  },
  {
    sequelize,
    modelName: 'MarketData',
    tableName: 'market_data',
    timestamps: true,
    indexes: [{ fields: ['cropName'] }],
  }
);

module.exports = { MarketData };
