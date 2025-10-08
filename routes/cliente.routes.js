const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/cliente.controller');
const clienteValidator = require('../validators/cliente.validator');
const validate = require('../middlewares/validate');

router.get('/', ClienteController.getAll);
router.get('/:id', ClienteController.getById);
router.post('/', clienteValidator.create, validate, ClienteController.create);
router.put('/:id', clienteValidator.update, validate, ClienteController.update);
router.delete('/:id', ClienteController.delete);

module.exports = router;
