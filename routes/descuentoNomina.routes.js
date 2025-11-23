const express = require('express');
const router = express.Router();
const descuentoNominaController = require('../controllers/descuentoNomina.controller');
const { authenticateToken, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { body, param } = require('express-validator');

router.use(authenticateToken);
router.post('/',
    [
        body('descripcion').isString().notEmpty(), 
        body('valor').isFloat({ gt: 0 }),
        body('fechaDescuento').isISO8601().toDate(),
        body('idEmpleado').isInt()
    ],
    validate,
    authorize('Administrador', 'Gerente'),
    descuentoNominaController.createDescuentoNomina
);
router.get('/',
    descuentoNominaController.getAllDescuentosNomina
);
router.get('/:id',
    param('id').isInt(),
    validate,
    descuentoNominaController.getDescuentoNominaById
);

module.exports = router;