const express = require('express');
const router = express.Router();
const categoriaEgresoController = require('../controllers/categoriaEgreso.controller');
const { authenticateToken, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { body, param } = require('express-validator');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todas las categorías de egreso
router.get('/', categoriaEgresoController.getAll);

// Obtener categoría por ID
router.get('/:id',
    [param('id').isInt()],
    validate,
    categoriaEgresoController.getById
);

// Crear categoría de egreso
router.post('/',
    authorize('Administrador', 'Gerente'),
    [
        body('nombre').notEmpty().withMessage('El nombre es requerido'),
        body('descripcion').optional().isString()
    ],
    validate,
    categoriaEgresoController.create
);

// Actualizar categoría de egreso
router.put('/:id',
    authorize('Administrador', 'Gerente'),
    [param('id').isInt()],
    validate,
    categoriaEgresoController.update
);

module.exports = router;
