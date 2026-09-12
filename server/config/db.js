require('dotenv').config();
const sequelize = require('./sequelize');

// Import all models (they register themselves on the sequelize instance)
const { Farmer } = require('../models/Farmer');
const { Crop } = require('../models/Crop');
const { WateringLog } = require('../models/WateringLog');
const { MarketData } = require('../models/MarketData');
const { Notification } = require('../models/Notification');

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
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('? MySQL Connected via Sequelize');

    // alter:true updates existing tables without dropping data
    await sequelize.sync({ alter: true });
    console.log('? MySQL tables synced successfully');
  } catch (error) {
    console.error(`? MySQL Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
