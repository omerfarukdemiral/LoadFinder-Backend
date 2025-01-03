const LoadService = require('../services/loadService');
const logger = require('../utils/logger');

class LoadController {
  async getAllLoads(req, res, next) {
    try {
      const loads = await LoadService.getAllLoads();
      res.json(loads);
    } catch (error) {
      logger.error('Yükler getirilirken hata oluştu:', error);
      next(error);
    }
  }

  // Diğer controller metodları...
}

module.exports = new LoadController(); 