const { body } = require('express-validator');

const servicioValidator = {
  create: [
    body('nombre')
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
    body('duracion')
      .notEmpty().withMessage('La duración es requerida')
      .isInt({ min: 1 }).withMessage('La duración debe ser mayor a 0'),
    body('categoria')
      .notEmpty().withMessage('La categoría es requerida')
      .isInt().withMessage('La categoría debe ser un número'),
    body('precio')
      .notEmpty().withMessage('El precio es requerido')
      .isDecimal().withMessage('El precio debe ser un número decimal'),
    body('porcentaje')
      .optional()
      .isDecimal().withMessage('El porcentaje debe ser un número decimal')
  ],
  update: [
    body('nombre')
      .optional()
      .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
    body('duracion')
      .optional()
      .isInt({ min: 1 }).withMessage('La duración debe ser mayor a 0'),
    body('precio')
      .optional()
      .isDecimal().withMessage('El precio debe ser un número decimal'),
    body('estado')
      .optional()
      .isInt({ min: 0, max: 1 }).withMessage('El estado debe ser 0 o 1')
  ]
};

module.exports = servicioValidator;
