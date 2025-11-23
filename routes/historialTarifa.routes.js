const express = require('express');
const router = express.Router();
const historialTarifaController = require('../controllers/historialTarifa.controller');
const { authenticateToken, authorize } = require('../middlewares/auth');

router.use(authenticateToken);

router.get('/', authorize('Administrador', 'Gerente'), historialTarifaController.getAll);

router.get('/resumen', authorize('Administrador', 'Gerente'), historialTarifaController.getResumen);

router.get('/servicio/:id', authorize('Administrador', 'Gerente'), historialTarifaController.getByServicio);

router.get('/servicio/:id/actual', authorize('Administrador', 'Gerente'), historialTarifaController.getTarifaActual);
module.exports = router;
