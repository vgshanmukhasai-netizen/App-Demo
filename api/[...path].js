const { app, connectDB } = require('../server/server');

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('API initialization failed:', error.message);
    return res.status(503).json({
      success: false,
      message: 'The API is temporarily unavailable. Please try again later.',
    });
  }
};