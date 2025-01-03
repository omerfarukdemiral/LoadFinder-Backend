require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./middlewares/error');
const logger = require('./utils/logger');
const initializeData = require('./utils/initData');
const SystemCheck = require('./utils/systemCheck');
const authRoutes = require('./routes/authRoutes');
const systemRoutes = require('./routes/systemRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));
app.use(express.json());

// CORS Pre-flight için OPTIONS isteklerini ele al
app.options('*', cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use(errorHandler);

// MongoDB bağlantısı app.js'de yapılacak
mongoose.set('debug', true);
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    logger.info('MongoDB\'ye başarıyla bağlanıldı');
    try {
      await initializeData();
      logger.info('Veriler başarıyla initialize edildi');
    } catch (error) {
      logger.error('Veri initialize hatası:', error);
    }
    const systemStatus = await SystemCheck.performHealthCheck();
    logger.info('Sistem başlatma kontrolü tamamlandı:', systemStatus);
  })
  .catch((error) => {
    logger.error('MongoDB bağlantı hatası:', error);
  });

module.exports = app; 