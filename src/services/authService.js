const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

class AuthService {
  async login(email, password) {
    try {
      // Password alanını dahil ederek kullanıcıyı bul
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        logger.warn(`Giriş başarısız: Kullanıcı bulunamadı (${email})`);
        throw new Error('Geçersiz email veya şifre');
      }

      if (!user.password) {
        logger.error(`Kullanıcının şifresi yok: ${email}`);
        throw new Error('Kullanıcı şifresi bulunamadı');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        logger.warn(`Giriş başarısız: Yanlış şifre (${email})`);
        throw new Error('Geçersiz şifre');
      }

      // Token oluştur
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Password'ü çıkar ve user bilgilerini döndür
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      logger.info(`Başarılı giriş: ${email}`);
      return { token, user: userWithoutPassword };
    } catch (error) {
      logger.error('Login servisi hatası:', error);
      throw error;
    }
  }

  async logout(userId) {
    try {
      // Kullanıcı kontrolü
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Kullanıcı bulunamadı');
      }

      // Gerekli logout işlemleri
      // Örneğin: Token invalidation, session temizleme vb.
      
      return true;
    } catch (error) {
      logger.error('Logout service error:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();
