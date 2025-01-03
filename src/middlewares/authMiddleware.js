const { verifyToken } = require('../config/jwt');
const User = require('../models/User');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      logger.error('Token bulunamadı');
      return res.status(401).json({
        success: false,
        message: 'Token bulunamadı'
      });
    }

    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.userId) {
      logger.error('Geçersiz token veya userId bulunamadı', { decoded });
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      logger.error('Geçersiz userId formatı', { userId: decoded.userId });
      return res.status(401).json({
        success: false,
        message: 'Geçersiz kullanıcı kimliği'
      });
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Yetkilendirme hatası'
    });
  }
};

module.exports = authMiddleware;