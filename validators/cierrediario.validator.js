const { body } = require('express-validator');

const cierreDiarioValidator = {
  create: [
    body('fecha')
      .notEmpty().withMessage('La fecha es requerida')
      .isDate().withMessage('Debe ser una fecha válida'),
    body('total')
      .notEmpty().withMessage('El total es requerido')
      .isDecimal().withMessage('El total debe ser un número decimal'),
    body('observacion')
      .optional()
      .isString().withMessage('La observación debe ser texto')
  ],
  update: [
    body('fecha')
      .optional()
      .isDate().withMessage('Debe ser una fecha válida'),
    body('total')
      .optional()
      .isDecimal().withMessage('El total debe ser un número decimal'),
    body('observacion')
      .optional()
      .isString().withMessage('La observación debe ser texto')
  ]
};

module.exports = cierreDiarioValidator;
