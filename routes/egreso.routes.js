const express = require('express');
const router = express.Router();
const EgresoController = require('../controllers/egreso.controller');
const egresoValidator = require('../validators/egreso.validator');
const validate = require('../middlewares/validate');

router.get('/', EgresoController.getAll);
router.get('/:id', EgresoController.getById);
router.post('/', egresoValidator.create, validate, EgresoController.create);
router.put('/:id', egresoValidator.update, validate, EgresoController.update);
router.delete('/:id', EgresoController.delete);

module.exports = router;
