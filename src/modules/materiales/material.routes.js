const express = require('express');
const router = express.Router();

const controller = require('./material.controller');
const { validateMaterial, runValidations } = require('../../middlewares/validators');

router.get('/', controller.getAllMateriales);
router.get('/:id', controller.getMaterialById);
router.post('/', validateMaterial, runValidations, controller.createMaterial);
router.put('/:id', validateMaterial, runValidations, controller.updateMaterial);
router.patch('/:id', controller.partialUpdateMaterial);
router.delete('/:id', controller.deleteMaterial);

module.exports = router;module.exports = {};
