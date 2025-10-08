const { body } = require('express-validator');

const rolValidator = {
  create: [
    body('nombre')
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ max: 50 }).withMessage('El nombre no puede exceder 50 caracteres'),
    body('descripcion')
      .optional()
      .isString().withMessage('La descripción debe ser texto'),
    body('estado')
      .optional()
      .isInt({ min: 0, max: 1 }).withMessage('El estado debe ser 0 o 1')
  ],
  update: [
    body('nombre')
      .optional()
      .isLength({ max: 50 }).withMessage('El nombre no puede exceder 50 caracteres'),
    body('descripcion')
      .optional()
      .isString().withMessage('La descripción debe ser texto'),
    body('estado')
      .optional()
      .isInt({ min: 0, max: 1 }).withMessage('El estado debe ser 0 o 1')
  ]
};

module.exports = rolValidator;
