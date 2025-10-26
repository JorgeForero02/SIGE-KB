const { body, param } = require('express-validator');

const createServicioValidator = [
    body('nombre')
        .notEmpty().withMessage('El nombre es requerido')
        .isString().withMessage('El nombre debe ser texto')
        .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
    body('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser texto'),
    body('duracion')
        .notEmpty().withMessage('La duración es requerida')
        .isInt({ min: 1 }).withMessage('La duración debe ser un número entero positivo'),
    body('categoria')
        .notEmpty().withMessage('La categoría es requerida')
        .isInt().withMessage('La categoría debe ser un número entero'),
    body('precio')
        .notEmpty().withMessage('El precio es requerido')
        .isDecimal().withMessage('El precio debe ser un número decimal'),
    body('porcentaje')
        .optional()
        .isDecimal().withMessage('El porcentaje debe ser un número decimal')
];

const updateServicioValidator = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('nombre')
        .optional()
        .isString().withMessage('El nombre debe ser texto'),
    body('precio')
        .optional()
        .isDecimal().withMessage('El precio debe ser un número decimal')
];

module.exports = {
    createServicioValidator,
    updateServicioValidator
};
