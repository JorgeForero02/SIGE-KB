const { body, param } = require('express-validator');

const createClienteValidator = [
    body('nombre')
        .notEmpty().withMessage('El nombre es requerido')
        .isString().withMessage('El nombre debe ser texto')
        .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
    body('apellido')
        .notEmpty().withMessage('El apellido es requerido')
        .isString().withMessage('El apellido debe ser texto')
        .isLength({ max: 100 }).withMessage('El apellido no puede exceder 100 caracteres'),
    body('telefono')
        .optional()
        .isString().withMessage('El teléfono debe ser texto'),
    body('tipo_documento')
        .notEmpty().withMessage('El tipo de documento es requerido')
        .isString().withMessage('El tipo de documento debe ser texto'),
    body('documento')
        .notEmpty().withMessage('El documento es requerido')
        .isString().withMessage('El documento debe ser texto')
        .isLength({ max: 20 }).withMessage('El documento no puede exceder 20 caracteres')
];

const updateClienteValidator = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('nombre')
        .optional()
        .isString().withMessage('El nombre debe ser texto'),
    body('apellido')
        .optional()
        .isString().withMessage('El apellido debe ser texto')
];

module.exports = {
    createClienteValidator,
    updateClienteValidator
};
