const express = require('express');
const router = express.Router();
const nominaController = require('../controllers/nomina.controller');
const { authenticateToken, authorize } = require('../middlewares/auth');

router.use(authenticateToken);

router.post('/calcular', authorize('Administrador', 'Gerente'), nominaController.calcularNomina);

router.get('/detalle', nominaController.getDetalleNomina);

router.get('/', authorize('Administrador', 'Gerente'), nominaController.getNominas);

router.get('/:id', nominaController.getNominaById);

module.exports = router;
