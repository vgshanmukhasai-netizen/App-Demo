const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');

class Farmer extends Model {}

Farmer.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name is required' },
        len: { args: [2, 100], msg: 'Name must be at least 2 characters' },
      },
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
      validate: {
        is: { args: /^[6-9]\d{9}$/, msg: 'Please enter a valid 10-digit Indian phone number' },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Please enter a valid email address' },
      },
      set(value) {
        this.setDataValue('email', value ? value.toLowerCase().trim() : value);
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // Stored as JSON — village, district, state, coordinates
    location: {
      type: DataTypes.JSON,
      defaultValue: { village: '', district: '', state: '', coordinates: { lat: null, lng: null } },
    },
    // Stored as JSON — totalArea, areaUnit, soilType, waterAvailability, irrigationType
    landDetails: {
      type: DataTypes.JSON,
      defaultValue: { totalArea: 0, areaUnit: 'acres', soilType: 'Loamy', waterAvailability: 'Rain-fed', irrigationType: 'None' },
    },
    lastSyncedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: 'Farmer',
    tableName: 'farmers',
    timestamps: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['phone'] },
    ],
  }
);

module.exports = { Farmer };
