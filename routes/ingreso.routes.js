const express = require('express');
const router = express.Router();
const IngresoController = require('../controllers/ingreso.controller');
const ingresoValidator = require('../validators/ingreso.validator');
const validate = require('../middlewares/validate');

router.get('/', IngresoController.getAll);
router.get('/:id', IngresoController.getById);
router.post('/', ingresoValidator.create, validate, IngresoController.create);
router.put('/:id', ingresoValidator.update, validate, IngresoController.update);
router.delete('/:id', IngresoController.delete);

module.exports = router;
