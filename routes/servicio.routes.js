const express = require('express');
const router = express.Router();
const ServicioController = require('../controllers/servicio.controller');
const servicioValidator = require('../validators/servicio.validator');
const validate = require('../middlewares/validate');

router.get('/', ServicioController.getAll);
router.get('/:id', ServicioController.getById);
router.post('/', servicioValidator.create, validate, ServicioController.create);
router.put('/:id', servicioValidator.update, validate, ServicioController.update);
router.delete('/:id', ServicioController.delete);

module.exports = router;
