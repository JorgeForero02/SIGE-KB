const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');
const { authenticateToken, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createClienteValidator, updateClienteValidator } = require('../validators/cliente.validator');
const { param } = require('express-validator');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todos los clientes
router.get('/', clienteController.getAll);

// Buscar cliente por documento
router.get('/documento/:documento', clienteController.getByDocumento);

// Obtener cliente por ID
router.get('/:id',
    [param('id').isInt()],
    validate,
    clienteController.getById
);

// Crear cliente
router.post('/',
    createClienteValidator,
    validate,
    clienteController.create
);

// Actualizar cliente
router.put('/:id',
    updateClienteValidator,
    validate,
    clienteController.update
);

module.exports = router;
