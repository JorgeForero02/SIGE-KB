const express = require('express');
const router = express.Router();
const citaController = require('../controllers/cita.controller');
const { authenticateToken, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    createCitaValidator,
    updateCitaValidator,
    updateEstadoCitaValidator
} = require('../validators/cita.validator');
const { param } = require('express-validator');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todas las citas
router.get('/', citaController.getAll);

// Obtener agenda de un empleado específico
router.get('/empleado/:empleadoId', citaController.getByEmpleado);

// Obtener cita por ID
router.get('/:id',
    [param('id').isInt()],
    validate,
    citaController.getById
);

// Crear cita
router.post('/',
    createCitaValidator,
    validate,
    citaController.create
);

// Actualizar cita
router.put('/:id',
    updateCitaValidator,
    validate,
    citaController.update
);

// Cambiar estado de cita
router.patch('/:id/estado',
    updateEstadoCitaValidator,
    validate,
    citaController.updateEstado
);

// Cancelar cita
router.delete('/:id',
    [param('id').isInt()],
    validate,
    citaController.delete
);

module.exports = router;
