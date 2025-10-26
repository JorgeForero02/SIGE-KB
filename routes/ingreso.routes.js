const express = require('express');
const router = express.Router();
const ingresoController = require('../controllers/ingreso.controller');
const { authenticateToken, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createIngresoValidator } = require('../validators/ingreso.validator');
const { param } = require('express-validator');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todos los ingresos
router.get('/',
    authorize('Administrador', 'Gerente'),
    ingresoController.getAll
);

// Obtener total del día
router.get('/total/dia',
    authorize('Administrador', 'Gerente'),
    ingresoController.getTotalDelDia
);

// Obtener ingreso por ID
router.get('/:id',
    authorize('Administrador', 'Gerente'),
    [param('id').isInt()],
    validate,
    ingresoController.getById
);

// Crear ingreso
router.post('/',
    authorize('Administrador', 'Gerente'),
    createIngresoValidator,
    validate,
    ingresoController.create
);

module.exports = router;
