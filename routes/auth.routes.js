const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { loginValidator } = require('../validators/auth.validator');
const validate = require('../middlewares/validate');
const { authenticateToken } = require('../middlewares/auth');

// Rutas públicas
router.post('/login', loginValidator, validate, authController.login);

// Rutas protegidas
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;
