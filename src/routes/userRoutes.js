const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, userController.getAllUsers);
router.put('/:userId', authMiddleware, userController.updateUser);

module.exports = router; 