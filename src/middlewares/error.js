const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Hata:', err);

  // Mongoose validation hatası
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validasyon hatası',
      errors: Object.values(err.errors).map(error => error.message)
    });
  }

  // Mongoose duplicate key hatası
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Bu kayıt zaten mevcut'
    });
  }

  // JWT hatası
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Geçersiz token'
    });
  }

  // JWT süresi dolmuş hatası
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token süresi dolmuş'
    });
  }

  // Genel hata durumu
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Sunucu hatası'
  });
};

module.exports = errorHandler; 