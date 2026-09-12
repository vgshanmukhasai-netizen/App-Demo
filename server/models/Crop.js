const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');

const GROWTH_STAGES = ['Planting', 'Seedling', 'Vegetative', 'Flowering', 'Fruit Development', 'Harvest'];

class Crop extends Model {}

Crop.init(
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
    cropName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { msg: 'Crop name is required' } },
    },
    landArea: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: { args: [0.1], msg: 'Land area must be at least 0.1' } },
    },
    areaUnit: {
      type: DataTypes.ENUM('acres', 'hectares', 'guntas'),
      defaultValue: 'acres',
    },
    plantingDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    expectedHarvestDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    expectedYield: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: null,
    },
    yieldUnit: {
      type: DataTypes.ENUM('kg', 'tonnes', 'quintals'),
      defaultValue: 'kg',
    },
    soilType: {
      type: DataTypes.ENUM('Red Sandy', 'Black Cotton', 'Loamy', 'Sandy Loam', 'Clay', 'Alluvial', 'Laterite', 'Other'),
      defaultValue: 'Loamy',
    },
    waterAvailability: {
      type: DataTypes.ENUM('Borewell', 'Canal', 'Rain-fed', 'River', 'Pond', 'Limited', 'Other'),
      defaultValue: 'Rain-fed',
    },
    currentGrowthStage: {
      type: DataTypes.ENUM('Planting', 'Seedling', 'Vegetative', 'Flowering', 'Fruit Development', 'Harvest'),
      defaultValue: 'Planting',
    },
    growthHistory: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM('Active', 'Harvested', 'Failed', 'Paused'),
      defaultValue: 'Active',
    },
    notes: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    lastWateredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    nextPlannedWatering: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    isOfflinePending: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    offlineId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: 'Crop',
    tableName: 'crops',
    timestamps: true,
    indexes: [
      { fields: ['farmerId'] },
      { fields: ['farmerId', 'status'] },
    ],
  }
);

module.exports = { Crop, GROWTH_STAGES };
