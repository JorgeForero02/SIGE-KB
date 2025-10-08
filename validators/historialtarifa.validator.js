const { body } = require('express-validator');

const historialTarifaValidator = {
  create: [
    body('servicio')
      .notEmpty().withMessage('El servicio es requerido')
      .isInt().withMessage('El servicio debe ser un número'),
    body('fecha_inicio')
      .notEmpty().withMessage('La fecha de inicio es requerida')
      .isDate().withMessage('Debe ser una fecha válida'),
    body('fecha_fin')
      .optional()
      .isDate().withMessage('Debe ser una fecha válida'),
    body('valor')
      .notEmpty().withMessage('El valor es requerido')
      .isDecimal().withMessage('El valor debe ser un número decimal')
  ],
  update: [
    body('fecha_inicio')
      .optional()
      .isDate().withMessage('Debe ser una fecha válida'),
    body('fecha_fin')
      .optional()
      .isDate().withMessage('Debe ser una fecha válida'),
    body('valor')
      .optional()
      .isDecimal().withMessage('El valor debe ser un número decimal')
  ]
};

module.exports = historialTarifaValidator;
