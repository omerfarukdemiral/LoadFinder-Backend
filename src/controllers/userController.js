const UserService = require('../services/userService');
const logger = require('../utils/logger');
const { generateToken } = require('../config/jwt');

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await UserService.getUsersWithDetails();
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      logger.error('Kullanıcılar listelenirken hata:', error);
      res.status(500).json({
        success: false,
        message: 'Kullanıcılar getirilirken bir hata oluştu'
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      logger.info('Profil güncelleme isteği:', { userId, data: req.body });

      // Güncellenebilir alanları belirle
      const updateData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        avatar: req.body.avatar
      };

      const updatedUser = await UserService.updateUser(userId, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'Kullanıcı bulunamadı'
        });
      }

      logger.info('Profil güncellendi:', { userId });
      res.json({
        success: true,
        data: updatedUser
      });
    } catch (error) {
      logger.error('Profil güncellenirken hata:', error);
      res.status(500).json({
        success: false,
        message: 'Profil güncellenirken bir hata oluştu'
      });
    }
  }

  async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const updatedUser = await UserService.updateUser(userId, req.body);
      res.json({
        success: true,
        data: updatedUser
      });
    } catch (error) {
      logger.error('Kullanıcı güncellenirken hata:', error);
      res.status(500).json({
        success: false,
        message: 'Kullanıcı güncellenirken bir hata oluştu'
      });
    }
  }
}

module.exports = new UserController(); 