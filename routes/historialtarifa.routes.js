const express = require('express');
const router = express.Router();
const HistorialTarifaController = require('../controllers/historialtarifa.controller');
const historialtarifaValidator = require('../validators/historialtarifa.validator');
const validate = require('../middlewares/validate');

router.get('/', HistorialTarifaController.getAll);
router.get('/:id', HistorialTarifaController.getById);
router.post('/', historialtarifaValidator.create, validate, HistorialTarifaController.create);
router.put('/:id', historialtarifaValidator.update, validate, HistorialTarifaController.update);
router.delete('/:id', HistorialTarifaController.delete);

module.exports = router;
