const { body } = require('express-validator');

const citaValidator = {
  create: [
    body('fecha')
      .notEmpty().withMessage('La fecha es requerida')
      .isDate().withMessage('Debe ser una fecha válida'),
    body('hora_inicio')
      .notEmpty().withMessage('La hora de inicio es requerida'),
    body('hora_fin')
      .notEmpty().withMessage('La hora de fin es requerida'),
    body('duracion')
      .notEmpty().withMessage('La duración es requerida')
      .isInt({ min: 1 }).withMessage('La duración debe ser mayor a 0'),
    body('encargado')
      .notEmpty().withMessage('El encargado es requerido')
      .isInt().withMessage('El encargado debe ser un número'),
    body('cliente')
      .notEmpty().withMessage('El cliente es requerido')
      .isInt().withMessage('El cliente debe ser un número')
  ],
  update: [
    body('fecha')
      .optional()
      .isDate().withMessage('Debe ser una fecha válida'),
    body('duracion')
      .optional()
      .isInt({ min: 1 }).withMessage('La duración debe ser mayor a 0')
  ]
};

module.exports = citaValidator;
