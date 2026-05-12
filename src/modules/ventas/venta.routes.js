const express = require('express');
const router = express.Router();

const controller = require('./venta.controller');
const { validateVenta, validateAnularVenta, runValidations } = require('../../middlewares/validators');

router.get('/', controller.getAllVentas);
router.get('/:id', controller.getVentaById);
router.post('/', validateVenta, runValidations, controller.createVenta);
router.put('/:id', validateVenta, runValidations, controller.updateVenta);
router.patch('/:id', controller.partialUpdateVenta);
router.patch('/:id/anular', validateAnularVenta, runValidations, controller.annulVenta);
router.delete('/:id', validateAnularVenta, runValidations, controller.deleteVenta);

module.exports = router;module.exports = {};
