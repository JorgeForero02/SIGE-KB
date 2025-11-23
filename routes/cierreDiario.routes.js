const express = require('express');
const router = express.Router();
const cierreDiarioController = require('../controllers/cierreDiario.controller');
const { authenticateToken, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { body, param } = require('express-validator');

// Todas las rutas requieren autenticación
router.use(authenticateToken);
// Obtener todos los cierres diarios
router.get('/',
    authorize('Administrador', 'Gerente'),
    cierreDiarioController.getAll
);
// Obtener cierre diario por ID
router.get('/:id',
    authorize('Administrador', 'Gerente'),
    [param('id').isInt()],
    validate,
    cierreDiarioController.getById
);  

// Crear nuevo cierre diario
router.post('/',
    authorize('Administrador', 'Gerente'),
    [
        body('fecha').isISO8601().toDate(),
        body('total').isFloat({ gt: 0 }),
        body('observacion').optional().isString()
    ],
    validate,
    cierreDiarioController.create
);