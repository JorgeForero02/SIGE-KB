const { body } = require('express-validator');

const createEgresoValidator = [
    body('fecha')
        .optional()
        .isDate().withMessage('La fecha debe ser válida'),
    body('categoria')
        .notEmpty().withMessage('La categoría es requerida')
        .isInt().withMessage('La categoría debe ser un número entero'),
    body('valor')
        .notEmpty().withMessage('El valor es requerido')
        .isDecimal().withMessage('El valor debe ser un número decimal')
        .custom((value) => {
            if (parseFloat(value) <= 0) {
                throw new Error('El valor debe ser positivo');
            }
            return true;
        }),
    body('medio_pago')
        .notEmpty().withMessage('El medio de pago es requerido')
        .isString().withMessage('El medio de pago debe ser texto'),
    body('proveedor')
        .optional()
        .isString().withMessage('El proveedor debe ser texto'),
    body('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser texto')
];

module.exports = {
    createEgresoValidator
};
