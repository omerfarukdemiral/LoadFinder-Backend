const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Profil güncelleme için özel route
router.put('/profile', authMiddleware, UserController.updateProfile);

// Diğer user routes
router.get('/', authMiddleware, UserController.getAllUsers);
router.put('/:userId', authMiddleware, UserController.updateUser);

module.exports = router; 