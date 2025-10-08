const { body } = require('express-validator');

const usuarioValidator = {
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
    body('email')
      .optional()
      .isEmail().withMessage('Debe ser un email válido'),
    body('telefono')
      .optional()
      .isLength({ max: 20 }).withMessage('El teléfono no puede exceder 20 caracteres'),
    body('rol')
      .notEmpty().withMessage('El rol es requerido')
      .isInt().withMessage('El rol debe ser un número entero')
  ],
  update: [
    body('nombre')
      .optional()
      .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
    body('apellido')
      .optional()
      .isLength({ max: 100 }).withMessage('El apellido no puede exceder 100 caracteres'),
    body('email')
      .optional()
      .isEmail().withMessage('Debe ser un email válido'),
    body('telefono')
      .optional()
      .isLength({ max: 20 }).withMessage('El teléfono no puede exceder 20 caracteres'),
    body('estado')
      .optional()
      .isInt({ min: 0, max: 1 }).withMessage('El estado debe ser 0 o 1')
  ]
};

module.exports = usuarioValidator;
