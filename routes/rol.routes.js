const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rol.controller');
const { authenticateToken, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { body, param } = require('express-validator');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todos los roles (cualquier usuario autenticado)
router.get('/', rolController.getAll);

// Obtener rol por ID
router.get('/:id',
    [param('id').isInt().withMessage('El ID debe ser un número entero')],
    validate,
    rolController.getById
);

// Crear rol (solo Administrador y Gerente)
router.post('/',
    authorize('Administrador', 'Gerente'),
    [
        body('nombre').notEmpty().withMessage('El nombre es requerido'),
        body('descripcion').optional().isString()
    ],
    validate,
    rolController.create
);

// Actualizar rol (solo Administrador y Gerente)
router.put('/:id',
    authorize('Administrador', 'Gerente'),
    [param('id').isInt()],
    validate,
    rolController.update
);

// Eliminar rol (solo Administrador)
router.delete('/:id',
    authorize('Administrador'),
    [param('id').isInt()],
    validate,
    rolController.delete
);

module.exports = router;
