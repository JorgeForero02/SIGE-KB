const express = require('express');
const router = express.Router();
const descuentoNominaController = require('../controllers/descuentoNomina.controller');
const { authenticateToken, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { body, param } = require('express-validator');

// Todas las rutas requieren autenticación
router.use(authenticateToken);
// Crear un nuevo descuento de nómina
router.post('/',
    [
        body('descripcion').isString().notEmpty(), 
        body('valor').isFloat({ gt: 0 }),
        body('fechaDescuento').isISO8601().toDate(),
        body('idEmpleado').isInt()
    ],
    validate,
    authorize('admin', 'gerente'),
    descuentoNominaController.createDescuentoNomina
);
// Obtener todos los descuentos de nómina
router.get('/',
    authorize('admin', 'gerente'),
    descuentoNominaController.getAllDescuentosNomina
);
// Obtener un descuento de nómina por ID
router.get('/:id',
    param('id').isInt(),
    validate,
    descuentoNominaController.getDescuentoNominaById
);

module.exports = router;