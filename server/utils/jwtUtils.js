const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token for a farmer
 * @param {string} farmerId - MongoDB ObjectId of the farmer
 * @param {string} email - Farmer's email
 * @returns {string} JWT token
 */
const generateToken = (farmerId, email) => {
  return jwt.sign(
    { farmerId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Verify a JWT token
 * @param {string} token - JWT string
 * @returns {object} Decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
