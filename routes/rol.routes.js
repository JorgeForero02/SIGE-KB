const express = require('express');
const router = express.Router();
const RolController = require('../controllers/rol.controller');
const rolValidator = require('../validators/rol.validator');
const validate = require('../middlewares/validate');

router.get('/', RolController.getAll);
router.get('/:id', RolController.getById);
router.post('/', rolValidator.create, validate, RolController.create);
router.put('/:id', rolValidator.update, validate, RolController.update);
router.delete('/:id', RolController.delete);

module.exports = router;
