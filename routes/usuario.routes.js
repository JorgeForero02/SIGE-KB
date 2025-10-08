const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuario.controller');
const usuarioValidator = require('../validators/usuario.validator');
const validate = require('../middlewares/validate');

router.get('/', UsuarioController.getAll);
router.get('/:id', UsuarioController.getById);
router.post('/', usuarioValidator.create, validate, UsuarioController.create);
router.put('/:id', usuarioValidator.update, validate, UsuarioController.update);
router.delete('/:id', UsuarioController.delete);

module.exports = router;
