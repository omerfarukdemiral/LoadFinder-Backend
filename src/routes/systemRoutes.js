const express = require('express');
const router = express.Router();
const SystemCheck = require('../utils/systemCheck');
const logger = require('../utils/logger');

router.get('/health', async (req, res) => {
  try {
    const status = await SystemCheck.performHealthCheck();
    logger.info('Sistem sağlık kontrolü yapıldı:', status);
    res.json(status);
  } catch (error) {
    logger.error('Sistem kontrolü başarısız:', error);
    res.status(500).json({
      status: 'error',
      message: 'Sistem kontrolü başarısız',
      error: error.message
    });
  }
});

module.exports = router; 