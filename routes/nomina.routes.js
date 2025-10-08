const express = require('express');
const router = express.Router();
const NominaController = require('../controllers/nomina.controller');
const nominaValidator = require('../validators/nomina.validator');
const validate = require('../middlewares/validate');

router.get('/', NominaController.getAll);
router.get('/:id', NominaController.getById);
router.post('/', nominaValidator.create, validate, NominaController.create);
router.put('/:id', nominaValidator.update, validate, NominaController.update);
router.delete('/:id', NominaController.delete);

module.exports = router;
