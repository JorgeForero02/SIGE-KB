const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { authenticateToken, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    createUsuarioValidator,
    updateUsuarioValidator,
    updateEstadoValidator,
    updatePasswordValidator
} = require('../validators/usuario.validator');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todos los usuarios
router.get('/',
    authorize('Administrador', 'Gerente'),
    usuarioController.getAll
);

// Obtener usuario por ID
router.get('/:id',
    usuarioController.getById
);

// Crear usuario (solo Gerente y Administrador)
router.post('/',
    authorize('Administrador', 'Gerente'),
    createUsuarioValidator,
    validate,
    usuarioController.create
);

// Actualizar usuario
router.put('/:id',
    authorize('Administrador', 'Gerente'),
    updateUsuarioValidator,
    validate,
    usuarioController.update
);

// Cambiar estado del usuario (activar/desactivar)
router.patch('/:id/estado',
    authorize('Administrador', 'Gerente'),
    updateEstadoValidator,
    validate,
    usuarioController.updateEstado
);

// Cambiar contraseña
router.patch('/:id/password',
    authorize('Administrador', 'Gerente'),
    updatePasswordValidator,
    validate,
    usuarioController.updatePassword
);

module.exports = router;
