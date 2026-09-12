const { sendError } = require('../utils/responseUtils');

/**
 * Global error handling middleware
 * Must be registered LAST in Express app (after all routes)
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return sendError(res, messages.join('. '), 400);
  }

  // Mongoose duplicate key error (unique field conflict)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, `${field} already exists. Please use a different ${field}.`, 409);
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return sendError(res, 'Invalid ID format.', 400);
  }

  // Default
  sendError(res, err.message || 'Internal server error', err.statusCode || 500);
};

/**
 * 404 Not Found middleware
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
