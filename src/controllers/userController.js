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