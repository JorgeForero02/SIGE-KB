const express = require('express');
const router = express.Router();
const egresoController = require('../controllers/egreso.controller');
const { authenticateToken, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createEgresoValidator } = require('../validators/egreso.validator');
const { param } = require('express-validator');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todos los egresos
router.get('/',
    authorize('Administrador', 'Gerente'),
    egresoController.getAll
);

// Obtener total del día
router.get('/total/dia',
    authorize('Administrador', 'Gerente'),
    egresoController.getTotalDelDia
);

// Obtener egreso por ID
router.get('/:id',
    authorize('Administrador', 'Gerente'),
    [param('id').isInt()],
    validate,
    egresoController.getById
);

// Crear egreso
router.post('/',
    authorize('Administrador', 'Gerente'),
    createEgresoValidator,
    validate,
    egresoController.create
);

module.exports = router;
