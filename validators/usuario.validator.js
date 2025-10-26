const { body, param } = require('express-validator');

const createUsuarioValidator = [
    body('nombre')
        .notEmpty().withMessage('El nombre es requerido')
        .isString().withMessage('El nombre debe ser texto')
        .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
    body('apellido')
        .notEmpty().withMessage('El apellido es requerido')
        .isString().withMessage('El apellido debe ser texto')
        .isLength({ max: 100 }).withMessage('El apellido no puede exceder 100 caracteres'),
    body('tipo_documento')
        .notEmpty().withMessage('El tipo de documento es requerido')
        .isString().withMessage('El tipo de documento debe ser texto'),
    body('documento')
        .notEmpty().withMessage('El documento es requerido')
        .isString().withMessage('El documento debe ser texto')
        .isLength({ max: 20 }).withMessage('El documento no puede exceder 20 caracteres'),
    body('email')
        .optional()
        .isEmail().withMessage('El email debe ser válido'),
    body('telefono')
        .optional()
        .isString().withMessage('El teléfono debe ser texto'),
    body('rol')
        .notEmpty().withMessage('El rol es requerido')
        .isInt().withMessage('El rol debe ser un número entero'),
    body('contrasena')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('categorias')
        .optional()
        .isArray().withMessage('Las categorías deben ser un array')
];

const updateUsuarioValidator = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('nombre')
        .optional()
        .isString().withMessage('El nombre debe ser texto')
        .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
    body('apellido')
        .optional()
        .isString().withMessage('El apellido debe ser texto')
        .isLength({ max: 100 }).withMessage('El apellido no puede exceder 100 caracteres'),
    body('email')
        .optional()
        .isEmail().withMessage('El email debe ser válido'),
    body('categorias')
        .optional()
        .isArray().withMessage('Las categorías deben ser un array')
];

const updateEstadoValidator = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('estado')
        .notEmpty().withMessage('El estado es requerido')
        .isIn([0, 1]).withMessage('El estado debe ser 0 o 1')
];

const updatePasswordValidator = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('nueva_contrasena')
        .notEmpty().withMessage('La nueva contraseña es requerida')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

module.exports = {
    createUsuarioValidator,
    updateUsuarioValidator,
    updateEstadoValidator,
    updatePasswordValidator
};
