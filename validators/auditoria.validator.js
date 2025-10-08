const { body } = require('express-validator');

const auditoriaValidator = {
  create: [
    body('fecha')
      .notEmpty().withMessage('La fecha es requerida')
      .isDate().withMessage('Debe ser una fecha válida'),
    body('hora')
      .notEmpty().withMessage('La hora es requerida'),
    body('mensaje')
      .notEmpty().withMessage('El mensaje es requerido')
      .isString().withMessage('El mensaje debe ser texto'),
    body('tipo')
      .notEmpty().withMessage('El tipo es requerido')
      .isLength({ max: 50 }).withMessage('El tipo no puede exceder 50 caracteres'),
    body('accion')
      .notEmpty().withMessage('La acción es requerida')
      .isLength({ max: 100 }).withMessage('La acción no puede exceder 100 caracteres')
  ],
  update: [
    body('mensaje')
      .optional()
      .isString().withMessage('El mensaje debe ser texto'),
    body('tipo')
      .optional()
      .isLength({ max: 50 }).withMessage('El tipo no puede exceder 50 caracteres'),
    body('accion')
      .optional()
      .isLength({ max: 100 }).withMessage('La acción no puede exceder 100 caracteres')
  ]
};

module.exports = auditoriaValidator;
