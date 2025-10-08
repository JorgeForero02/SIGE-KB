const { body } = require('express-validator');

const nominaValidator = {
  create: [
    body('fecha_inicio')
      .notEmpty().withMessage('La fecha de inicio es requerida')
      .isDate().withMessage('Debe ser una fecha válida'),
    body('fecha_fin')
      .notEmpty().withMessage('La fecha de fin es requerida')
      .isDate().withMessage('Debe ser una fecha válida'),
    body('empleado')
      .notEmpty().withMessage('El empleado es requerido')
      .isInt().withMessage('El empleado debe ser un número'),
    body('total')
      .notEmpty().withMessage('El total es requerido')
      .isDecimal().withMessage('El total debe ser un número decimal')
  ],
  update: [
    body('fecha_inicio')
      .optional()
      .isDate().withMessage('Debe ser una fecha válida'),
    body('fecha_fin')
      .optional()
      .isDate().withMessage('Debe ser una fecha válida'),
    body('total')
      .optional()
      .isDecimal().withMessage('El total debe ser un número decimal')
  ]
};

module.exports = nominaValidator;
