const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/categoria.controller');
const categoriaValidator = require('../validators/categoria.validator');
const validate = require('../middlewares/validate');

router.get('/', CategoriaController.getAll);
router.get('/:id', CategoriaController.getById);
router.post('/', categoriaValidator.create, validate, CategoriaController.create);
router.put('/:id', categoriaValidator.update, validate, CategoriaController.update);
router.delete('/:id', CategoriaController.delete);

module.exports = router;
