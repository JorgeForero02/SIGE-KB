const { body, param } = require('express-validator');

const createCitaValidator = [
    body('fecha')
        .notEmpty().withMessage('La fecha es requerida')
        .isDate().withMessage('La fecha debe ser válida'),
    body('hora_inicio')
        .notEmpty().withMessage('La hora de inicio es requerida')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('La hora debe estar en formato HH:MM'),
    body('duracion')
        .notEmpty().withMessage('La duración es requerida')
        .isInt({ min: 1 }).withMessage('La duración debe ser un número entero positivo'),
    body('encargado')
        .notEmpty().withMessage('El encargado es requerido')
        .isInt().withMessage('El encargado debe ser un número entero'),
    body('cliente')
        .notEmpty().withMessage('El cliente es requerido')
        .isInt().withMessage('El cliente debe ser un número entero')
];

const updateCitaValidator = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('fecha')
        .optional()
        .isDate().withMessage('La fecha debe ser válida'),
    body('hora_inicio')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('La hora debe estar en formato HH:MM'),
    body('duracion')
        .optional()
        .isInt({ min: 1 }).withMessage('La duración debe ser un número entero positivo')
];

const updateEstadoCitaValidator = [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    body('estado')
        .notEmpty().withMessage('El estado es requerido')
        .isIn(['pendiente', 'confirmada', 'cancelada', 'completada'])
        .withMessage('Estado inválido')
];

module.exports = {
    createCitaValidator,
    updateCitaValidator,
    updateEstadoCitaValidator
};
