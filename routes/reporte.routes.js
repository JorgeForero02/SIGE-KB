const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporte.controller');
const { authenticateToken, authorize } = require('../middlewares/auth');

router.use(authenticateToken);
router.use(authorize('Administrador', 'Gerente'));

router.get('/mensual', reporteController.getReporteMensual);

router.get('/personalizado', reporteController.getReportePersonalizado);

module.exports = router;
