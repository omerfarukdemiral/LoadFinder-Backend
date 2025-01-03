const app = require('./src/app');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5500;

// Server başlatma işlemi server.js'de yapılacak
app.listen(PORT, () => {
  logger.info(`Server ${PORT} portunda çalışıyor`);
}); 