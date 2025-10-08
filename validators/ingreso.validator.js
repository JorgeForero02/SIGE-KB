const { body } = require('express-validator');

const ingresoValidator = {
  create: [
    body('fecha')
      .notEmpty().withMessage('La fecha es requerida')
      .isDate().withMessage('Debe ser una fecha válida'),
    body('servicio')
      .notEmpty().withMessage('El servicio es requerido')
      .isInt().withMessage('El servicio debe ser un número'),
    body('cita')
      .optional()
      .isInt().withMessage('La cita debe ser un número'),
    body('extra')
      .optional()
      .isDecimal().withMessage('El extra debe ser un número decimal'),
    body('valor')
      .notEmpty().withMessage('El valor es requerido')
      .isDecimal().withMessage('El valor debe ser un número decimal'),
    body('descripcion')
      .optional()
      .isString().withMessage('La descripción debe ser texto')
  ],
  update: [
    body('fecha')
      .optional()
      .isDate().withMessage('Debe ser una fecha válida'),
    body('extra')
      .optional()
      .isDecimal().withMessage('El extra debe ser un número decimal'),
    body('valor')
      .optional()
      .isDecimal().withMessage('El valor debe ser un número decimal'),
    body('descripcion')
      .optional()
      .isString().withMessage('La descripción debe ser texto')
  ]
};

module.exports = ingresoValidator;
