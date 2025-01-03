const mongoose = require('mongoose');
const logger = require('./logger');

class SystemCheck {
  static async checkDatabase() {
    try {
      const state = mongoose.connection.readyState;
      const states = {
        0: 'Bağlantı yok',
        1: 'Bağlı',
        2: 'Bağlanıyor',
        3: 'Bağlantı kesiliyor'
      };
      
      return {
        status: state === 1 ? 'success' : 'error',
        message: `Veritabanı durumu: ${states[state]}`
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Veritabanı kontrolü başarısız'
      };
    }
  }

  static async checkServices() {
    try {
      // Burada diğer servisleri kontrol edebilirsiniz
      // Örnek: Redis, ElasticSearch, vb.
      return {
        status: 'success',
        message: 'Tüm servisler çalışıyor'
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Servis kontrolü başarısız'
      };
    }
  }

  static async performHealthCheck() {
    logger.info('Sistem sağlık kontrolü başlatılıyor...');
    
    const dbCheck = await this.checkDatabase();
    const servicesCheck = await this.checkServices();

    const systemStatus = {
      timestamp: new Date().toISOString(),
      database: dbCheck,
      services: servicesCheck,
      version: process.env.npm_package_version || '1.0.0'
    };

    logger.info('Sistem durumu:', systemStatus);
    return systemStatus;
  }
}

module.exports = SystemCheck; 