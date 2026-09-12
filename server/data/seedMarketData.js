require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'agroself',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    logging: false,
  }
);

const { MarketData } = require('../models/MarketData');

const marketSeedData = [
  { cropName: 'Tomato', pricePerKg: 25, demandLevel: 'High', priceTrend: 'Rising', market: 'Guntur APMC', state: 'Andhra Pradesh' },
  { cropName: 'Chilli', pricePerKg: 42, demandLevel: 'High', priceTrend: 'Stable', market: 'Guntur APMC', state: 'Andhra Pradesh' },
  { cropName: 'Groundnut', pricePerKg: 60, demandLevel: 'Medium', priceTrend: 'Stable', market: 'Kurnool APMC', state: 'Andhra Pradesh' },
  { cropName: 'Cotton', pricePerKg: 65, demandLevel: 'High', priceTrend: 'Rising', market: 'Adilabad APMC', state: 'Telangana' },
  { cropName: 'Maize', pricePerKg: 20, demandLevel: 'Medium', priceTrend: 'Stable', market: 'Nizamabad APMC', state: 'Telangana' },
  { cropName: 'Rice', pricePerKg: 35, demandLevel: 'High', priceTrend: 'Stable', market: 'Nellore APMC', state: 'Andhra Pradesh' },
  { cropName: 'Onion', pricePerKg: 28, demandLevel: 'High', priceTrend: 'Rising', market: 'Nashik APMC', state: 'Maharashtra' },
  { cropName: 'Potato', pricePerKg: 18, demandLevel: 'Medium', priceTrend: 'Falling', market: 'Agra APMC', state: 'Uttar Pradesh' },
  { cropName: 'Brinjal', pricePerKg: 22, demandLevel: 'Medium', priceTrend: 'Stable', market: 'Local Market', state: 'Andhra Pradesh' },
  { cropName: 'Turmeric', pricePerKg: 120, demandLevel: 'High', priceTrend: 'Rising', market: 'Nizamabad APMC', state: 'Telangana' },
  { cropName: 'Sunflower', pricePerKg: 50, demandLevel: 'Medium', priceTrend: 'Stable', market: 'Kurnool APMC', state: 'Andhra Pradesh' },
  { cropName: 'Soybean', pricePerKg: 48, demandLevel: 'High', priceTrend: 'Rising', market: 'Indore APMC', state: 'Madhya Pradesh' },
  { cropName: 'Moong Dal', pricePerKg: 90, demandLevel: 'High', priceTrend: 'Rising', market: 'Jaipur APMC', state: 'Rajasthan' },
  { cropName: 'Sugarcane', pricePerKg: 4, demandLevel: 'Medium', priceTrend: 'Stable', market: 'Kolhapur APMC', state: 'Maharashtra' },
  { cropName: 'Wheat', pricePerKg: 22, demandLevel: 'High', priceTrend: 'Stable', market: 'Punjab APMC', state: 'Punjab' },
];

const seedData = async () => {
  try {
    await sequelize.authenticate();
    console.log('? Connected to MySQL');

    await MarketData.sync({ force: false });
    await MarketData.destroy({ where: {}, truncate: true });
    console.log('???  Cleared existing market data');

    await MarketData.bulkCreate(marketSeedData);
    console.log(`? Seeded ${marketSeedData.length} market records`);

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('? Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
