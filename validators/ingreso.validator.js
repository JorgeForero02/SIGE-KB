const { body, query } = require('express-validator');

const createIngresoValidator = [
    body('fecha')
        .optional()
        .isDate().withMessage('La fecha debe ser válida'),
    body('servicio')
        .notEmpty().withMessage('El servicio es requerido')
        .isInt().withMessage('El servicio debe ser un número entero'),
    body('empleado')
        .notEmpty().withMessage('El empleado es requerido')
        .isInt().withMessage('El empleado debe ser un número entero'),
    body('cita')
        .optional()
        .isInt().withMessage('La cita debe ser un número entero'),
    body('extra')
        .optional()
        .isDecimal().withMessage('El extra debe ser un número decimal'),
    body('valor')
        .notEmpty().withMessage('El valor es requerido')
        .isDecimal().withMessage('El valor debe ser un número decimal'),
    body('medio_pago')
        .notEmpty().withMessage('El medio de pago es requerido')
        .isString().withMessage('El medio de pago debe ser texto'),
    body('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser texto')
];

module.exports = {
    createIngresoValidator
};
