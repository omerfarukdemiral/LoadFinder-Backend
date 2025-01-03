const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Auth işlemleri
router.post('/login', AuthController.login);
router.post('/logout', authMiddleware, AuthController.logout);
router.get('/me', authMiddleware, AuthController.getCurrentUser);

// İki aşamalı kayıt rotaları
router.post('/register/initiate', AuthController.initiateRegistration);
router.post('/register/complete/:userId', AuthController.completeRegistration);

module.exports = router;