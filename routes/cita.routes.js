const express = require('express');
const router = express.Router();
const CitaController = require('../controllers/cita.controller');
const citaValidator = require('../validators/cita.validator');
const validate = require('../middlewares/validate');

router.get('/', CitaController.getAll);
router.get('/:id', CitaController.getById);
router.post('/', citaValidator.create, validate, CitaController.create);
router.put('/:id', citaValidator.update, validate, CitaController.update);
router.delete('/:id', CitaController.delete);

module.exports = router;
