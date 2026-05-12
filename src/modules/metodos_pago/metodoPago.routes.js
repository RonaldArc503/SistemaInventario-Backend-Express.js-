const express = require('express');
const router = express.Router();

const controller = require('./metodoPago.controller');
const { validateMetodoPago, runValidations } = require('../../middlewares/validators');

router.get('/', controller.getAllMetodosPago);
router.get('/:id', controller.getMetodoPagoById);
router.post('/', validateMetodoPago, runValidations, controller.createMetodoPago);
router.put('/:id', validateMetodoPago, runValidations, controller.updateMetodoPago);
router.patch('/:id', controller.partialUpdateMetodoPago);
router.delete('/:id', controller.deleteMetodoPago);

module.exports = router;module.exports = {};
