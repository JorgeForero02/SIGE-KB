const express = require('express');
const router = express.Router();
const AuditoriaController = require('../controllers/auditoria.controller');
const auditoriaValidator = require('../validators/auditoria.validator');
const validate = require('../middlewares/validate');

router.get('/', AuditoriaController.getAll);
router.get('/:id', AuditoriaController.getById);
router.post('/', auditoriaValidator.create, validate, AuditoriaController.create);
router.put('/:id', auditoriaValidator.update, validate, AuditoriaController.update);
router.delete('/:id', AuditoriaController.delete);

module.exports = router;
