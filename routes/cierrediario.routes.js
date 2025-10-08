const express = require('express');
const router = express.Router();
const CierreDiarioController = require('../controllers/cierrediario.controller');
const cierrediarioValidator = require('../validators/cierrediario.validator');
const validate = require('../middlewares/validate');

router.get('/', CierreDiarioController.getAll);
router.get('/:id', CierreDiarioController.getById);
router.post('/', cierrediarioValidator.create, validate, CierreDiarioController.create);
router.put('/:id', cierrediarioValidator.update, validate, CierreDiarioController.update);
router.delete('/:id', CierreDiarioController.delete);

module.exports = router;
