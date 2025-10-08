const express = require('express');
const router = express.Router();
const CategoriaEgresoController = require('../controllers/categoriaegreso.controller');
const categoriaegresoValidator = require('../validators/categoriaegreso.validator');
const validate = require('../middlewares/validate');

router.get('/', CategoriaEgresoController.getAll);
router.get('/:id', CategoriaEgresoController.getById);
router.post('/', categoriaegresoValidator.create, validate, CategoriaEgresoController.create);
router.put('/:id', categoriaegresoValidator.update, validate, CategoriaEgresoController.update);
router.delete('/:id', CategoriaEgresoController.delete);

module.exports = router;
