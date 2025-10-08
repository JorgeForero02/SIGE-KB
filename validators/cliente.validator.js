const { body } = require('express-validator');

const clienteValidator = {
  create: [
    body('nombre')
      .notEmpty().withMessage('El nombre es requerido')
      .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
    body('apellido')
      .notEmpty().withMessage('El apellido es requerido')
      .isLength({ max: 100 }).withMessage('El apellido no puede exceder 100 caracteres'),
    body('tipo_documento')
      .notEmpty().withMessage('El tipo de documento es requerido'),
    body('documento')
      .notEmpty().withMessage('El documento es requerido')
      .isLength({ max: 20 }).withMessage('El documento no puede exceder 20 caracteres'),
    body('telefono')
      .optional()
      .isLength({ max: 20 }).withMessage('El teléfono no puede exceder 20 caracteres')
  ],
  update: [
    body('nombre')
      .optional()
      .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
    body('apellido')
      .optional()
      .isLength({ max: 100 }).withMessage('El apellido no puede exceder 100 caracteres'),
    body('telefono')
      .optional()
      .isLength({ max: 20 }).withMessage('El teléfono no puede exceder 20 caracteres')
  ]
};

module.exports = clienteValidator;
