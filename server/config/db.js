require('dotenv').config();
const sequelize = require('./sequelize');

// Import all models (they register themselves on the sequelize instance)
const { Farmer } = require('../models/Farmer');
const { Crop } = require('../models/Crop');
const { WateringLog } = require('../models/WateringLog');
const { MarketData } = require('../models/MarketData');
const { Notification } = require('../models/Notification');

let connectionPromise;

// --- Associations --------------------------------------------------------------
Farmer.hasMany(Crop, { foreignKey: 'farmerId', onDelete: 'CASCADE' });
Crop.belongsTo(Farmer, { foreignKey: 'farmerId' });

Farmer.hasMany(WateringLog, { foreignKey: 'farmerId', onDelete: 'CASCADE' });
WateringLog.belongsTo(Farmer, { foreignKey: 'farmerId' });

Crop.hasMany(WateringLog, { foreignKey: 'cropId', onDelete: 'CASCADE' });
WateringLog.belongsTo(Crop, { foreignKey: 'cropId' });

Farmer.hasMany(Notification, { foreignKey: 'farmerId', onDelete: 'CASCADE' });
Notification.belongsTo(Farmer, { foreignKey: 'farmerId' });

// --- Connect & Sync ------------------------------------------------------------
const connectDB = () => {
  if (!connectionPromise) {
    connectionPromise = (async () => {
      try {
        await sequelize.authenticate();
        console.log('MySQL connected via Sequelize');

        await sequelize.sync({ alter: true });
        console.log('MySQL tables synced successfully');
      } catch (error) {
        connectionPromise = null;
        console.error(`MySQL connection error: ${error.message}`);
        throw error;
      }
    })();
  }

  return connectionPromise;
};

module.exports = connectDB;
