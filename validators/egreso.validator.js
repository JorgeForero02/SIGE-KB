const { body } = require('express-validator');

const egresoValidator = {
  create: [
    body('fecha')
      .notEmpty().withMessage('La fecha es requerida')
      .isDate().withMessage('Debe ser una fecha válida'),
    body('categoria')
      .notEmpty().withMessage('La categoría es requerida')
      .isInt().withMessage('La categoría debe ser un número'),
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
    body('valor')
      .optional()
      .isDecimal().withMessage('El valor debe ser un número decimal'),
    body('descripcion')
      .optional()
      .isString().withMessage('La descripción debe ser texto'),
    body('estado')
      .optional()
      .isInt({ min: 0, max: 1 }).withMessage('El estado debe ser 0 o 1')
  ]
};

module.exports = egresoValidator;
