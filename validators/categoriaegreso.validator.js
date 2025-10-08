const { body } = require('express-validator');

const categoriaEgresoValidator = {
  create: [
    body('nombre')
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
    body('descripcion')
      .optional()
      .isString().withMessage('La descripción debe ser texto')
  ],
  update: [
    body('nombre')
      .optional()
      .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
    body('descripcion')
      .optional()
      .isString().withMessage('La descripción debe ser texto'),
    body('estado')
      .optional()
      .isInt({ min: 0, max: 1 }).withMessage('El estado debe ser 0 o 1')
  ]
};

module.exports = categoriaEgresoValidator;
