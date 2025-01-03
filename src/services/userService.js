const BaseService = require('./baseService');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Shipper = require('../models/Shipper');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

class UserService extends BaseService {
  constructor() {
    super(User);
  }

  async initiateRegistration(userData) {
    try {
      // Şifreyi hashleme
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Geçici kullanıcı oluşturma (role henüz belirlenmedi)
      const tempUser = await this.create({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        phone: userData.phone,
        status: 'inactive' // Rol seçimi yapılana kadar inactive
      });

      return tempUser;
    } catch (error) {
      logger.error('Kullanıcı kaydı başlatılırken hata:', error);
      throw error;
    }
  }

  async completeRegistration(userId, roleData) {
    try {
      const { role, ...profileData } = roleData;
      
      // Kullanıcı rolünü güncelle ve aktifleştir
      const updatedUser = await this.update(userId, {
        role,
        status: 'active'
      });

      // Role göre profil detaylarını oluştur
      let profileDetails;
      if (role === 'driver') {
        profileDetails = await Driver.create({
          user: userId,
          driverLicenseNo: profileData.driverLicenseNo,
          vehicleType: profileData.vehicleType,
          vehiclePlate: profileData.vehiclePlate,
          experience: profileData.experience
        });
      } else if (role === 'shipper') {
        profileDetails = await Shipper.create({
          user: userId,
          companyName: profileData.companyName,
          taxNumber: profileData.taxNumber,
          companyAddress: profileData.companyAddress,
          sector: profileData.sector
        });
      }

      // Kullanıcı ve profil detaylarını birleştirip dön
      return {
        ...updatedUser.toObject(),
        details: profileDetails
      };
    } catch (error) {
      logger.error('Kullanıcı kaydı tamamlanırken hata:', error);
      throw error;
    }
  }

  async getUsersWithDetails() {
    try {
      const users = await this.find();
      const detailedUsers = await Promise.all(
        users.map(async (user) => {
          const details = await this.getUserDetails(user._id);
          return details;
        })
      );
      return detailedUsers;
    } catch (error) {
      logger.error('Kullanıcı detayları getirilirken hata:', error);
      throw error;
    }
  }

  async getUserDetails(userId) {
    try {
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Geçersiz kullanıcı kimliği');
      }

      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        throw new Error('Kullanıcı bulunamadı');
      }

      // Kullanıcı rolüne göre detayları getir
      let details = null;
      if (user.role === 'driver') {
        details = await Driver.findOne({ user: userId }).lean();
      } else if (user.role === 'shipper') {
        details = await Shipper.findOne({ user: userId }).lean();
      }

      return { ...user.toObject(), details };
    } catch (error) {
      logger.error('getUserDetails error:', error);
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      const { firstName, lastName, email, phone, address, avatar } = userData;
      
      // Ana kullanıcı bilgilerini güncelle
      const updatedUser = await this.update(userId, {
        firstName,
        lastName,
        email,
        phone,
        address,
        avatar
      });

      // Güncel kullanıcı bilgilerini detaylarıyla birlikte getir
      return await this.getUserDetails(userId);
    } catch (error) {
      logger.error('Kullanıcı güncellenirken hata:', error);
      throw error;
    }
  }
}

module.exports = new UserService(); 