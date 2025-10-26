const { body } = require('express-validator');

const loginValidator = [
    body('documento')
        .notEmpty().withMessage('El documento es requerido')
        .isString().withMessage('El documento debe ser texto'),
    body('contrasena')
        .notEmpty().withMessage('La contraseña es requerida')
        .isString().withMessage('La contraseña debe ser texto')
];

module.exports = {
    loginValidator
};
