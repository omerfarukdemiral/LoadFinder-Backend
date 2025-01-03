const AuthService = require('../services/authService');
const UserService = require('../services/userService');
const logger = require('../utils/logger');
const { generateToken } = require('../config/jwt');

class AuthController {
  async login(req, res, next) {
    logger.info('Login isteği alındı:', {
      body: req.body,
      headers: req.headers
    });

    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      
      logger.info('Login başarılı:', { email });
      
      res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
      res.header('Access-Control-Allow-Credentials', 'true');
      
      res.json({
        success: true,
        token: result.token,
        user: result.user
      });
    } catch (error) {
      logger.error('Giriş yapılırken hata oluştu:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Giriş başarısızzz'
      });
    }
  }

  async logout(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          success: false,
          message: 'Oturum bulunamadı'
        });
      }

      await AuthService.logout(req.user.userId);
      
      res.json({
        success: true,
        message: 'Başarıyla çıkış yapıldı'
      });
    } catch (error) {
      logger.error('Çıkış yapılırken hata oluştu:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Çıkış işlemi başarısız'
      });
    }
  }


  async initiateRegistration(req, res) {
    try {
      const userData = req.body;
      const tempUser = await UserService.initiateRegistration(userData);
      
      res.json({
        success: true,
        data: {
          userId: tempUser._id,
          message: 'İlk aşama kayıt başarılı'
        }
      });
    } catch (error) {
      logger.error('Kayıt başlatma hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Kayıt işlemi başlatılırken bir hata oluştu'
      });
    }
  }

  async completeRegistration(req, res) {
    try {
      const { userId } = req.params;
      const roleData = req.body;
      
      const completedUser = await UserService.completeRegistration(userId, roleData);
      
      const token = generateToken(completedUser);
      
      res.json({
        success: true,
        data: {
          user: completedUser,
          token: token
        }
      });
    } catch (error) {
      logger.error('Kayıt tamamlama hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Kayıt işlemi tamamlanırken bir hata oluştu'
      });
    }
  }

  async getCurrentUser(req, res) {
    try {
      if (!req.user || !req.user.userId) {
        logger.error('getCurrentUser: User ID bulunamadı', { user: req.user });
        return res.status(401).json({
          success: false,
          message: 'Oturum bulunamadı'
        });
      }

      const user = await UserService.getUserDetails(req.user.userId);
      
      if (!user) {
        logger.error('getCurrentUser: Kullanıcı bulunamadı', { userId: req.user.userId });
        return res.status(404).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error('Kullanıcı bilgileri getirilirken hata:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Kullanıcı bilgileri alınamadı'
      });
    }
  }
}


module.exports = new AuthController();
