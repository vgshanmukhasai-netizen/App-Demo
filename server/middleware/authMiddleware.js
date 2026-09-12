const { verifyToken } = require('../utils/jwtUtils');
const { sendError } = require('../utils/responseUtils');

/**
 * JWT Authentication Middleware
 * Verifies JWT from Authorization header and injects farmerId into req
 */
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'No token provided. Please login.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Inject farmerId into request — controllers MUST use this, never req.body.farmerId
    req.farmerId = decoded.farmerId;
    req.farmerEmail = decoded.email;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Session expired. Please login again.', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 'Invalid token. Please login again.', 401);
    }
    return sendError(res, 'Authentication failed.', 401);
  }
};

module.exports = { protect };
