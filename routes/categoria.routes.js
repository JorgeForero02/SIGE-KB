const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller');
const { authenticateToken, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { body, param } = require('express-validator');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todas las categorías
router.get('/', categoriaController.getAll);

// Obtener categoría por ID
router.get('/:id',
    [param('id').isInt()],
    validate,
    categoriaController.getById
);

// Crear categoría (solo Gerente y Administrador)
router.post('/',
    authorize('Administrador', 'Gerente'),
    [
        body('nombre').notEmpty().withMessage('El nombre es requerido'),
        body('descripcion').optional().isString()
    ],
    validate,
    categoriaController.create
);

// Actualizar categoría
router.put('/:id',
    authorize('Administrador', 'Gerente'),
    [param('id').isInt()],
    validate,
    categoriaController.update
);

// Eliminar categoría
router.delete('/:id',
    authorize('Administrador', 'Gerente'),
    [param('id').isInt()],
    validate,
    categoriaController.delete
);

module.exports = router;
