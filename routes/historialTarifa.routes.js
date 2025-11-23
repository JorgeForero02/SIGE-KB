const express = require('express');
const router = express.Router();
const historialTarifaController = require('../controllers/historialTarifa.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', historialTarifaController.getAll);

router.get('/resumen', historialTarifaController.getResumen);

router.get('/servicio/:id', historialTarifaController.getByServicio);

router.get('/servicio/:id/actual', historialTarifaController.getTarifaActual);

module.exports = router;
