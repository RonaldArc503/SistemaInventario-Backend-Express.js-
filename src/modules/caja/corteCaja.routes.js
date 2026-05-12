const express = require('express');
const router = express.Router();

const controller = require('./corteCaja.controller');
const { validateCorteCaja, runValidations } = require('../../middlewares/validators');

router.get('/', controller.getAllCortesCaja);
router.get('/:id', controller.getCorteCajaById);
router.post('/', validateCorteCaja, runValidations, controller.createCorteCaja);
router.put('/:id', validateCorteCaja, runValidations, controller.updateCorteCaja);
router.patch('/:id', controller.partialUpdateCorteCaja);
router.delete('/:id', controller.deleteCorteCaja);

module.exports = router;
