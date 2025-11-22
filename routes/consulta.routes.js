const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consulta.controller');
const { authenticateToken, authorize } = require('../middlewares/auth');

router.use(authenticateToken);

router.get('/agenda-diaria', consultaController.getAgendaDiaria);

router.get('/historial-servicios', consultaController.getHistorialServicios);

router.get('/servicios-por-empleado', authorize('Administrador', 'Gerente'), consultaController.getServiciosPorEmpleado);

module.exports = router;
