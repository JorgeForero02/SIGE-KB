const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicio.controller');
const { authenticateToken, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createServicioValidator, updateServicioValidator } = require('../validators/servicio.validator');
const { param } = require('express-validator');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todos los servicios
router.get('/', servicioController.getAll);

// Obtener servicio por ID
router.get('/:id',
    [param('id').isInt()],
    validate,
    servicioController.getById
);

// Crear servicio (solo Gerente y Administrador)
router.post('/',
    authorize('Administrador', 'Gerente'),
    createServicioValidator,
    validate,
    servicioController.create
);

// Actualizar servicio
router.put('/:id',
    authorize('Administrador', 'Gerente'),
    updateServicioValidator,
    validate,
    servicioController.update
);

// Eliminar servicio
router.delete('/:id',
    authorize('Administrador', 'Gerente'),
    [param('id').isInt()],
    validate,
    servicioController.delete
);

module.exports = router;
