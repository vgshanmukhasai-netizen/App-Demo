const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');

class WateringLog extends Model {}

WateringLog.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    farmerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    cropId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    wateredAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    method: {
      type: DataTypes.ENUM('Drip', 'Sprinkler', 'Flood', 'Manual', 'Rain', 'Other'),
      defaultValue: 'Manual',
    },
    durationMinutes: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null,
    },
    notes: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    isOfflinePending: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'WateringLog',
    tableName: 'watering_logs',
    timestamps: true,
    indexes: [
      { fields: ['farmerId'] },
      { fields: ['cropId'] },
      { fields: ['cropId', 'wateredAt'] },
    ],
  }
);

module.exports = { WateringLog };
