const express = require('express');
const router = express.Router();
const descuentoNominaController = require('../controllers/descuentoNomina.controller');
const { authenticateToken,  authorize} = require('../middlewares/auth');

router.use(authenticateToken);

router.post('/', authorize('admin', 'gerente'), descuentoNominaController.createDescuentoNomina);

router.get('/:id', descuentoNominaController.getDescuentoNominaById);

router.get('/', descuentoNominaController.getAllDescuentosNomina);

module.exports = router;