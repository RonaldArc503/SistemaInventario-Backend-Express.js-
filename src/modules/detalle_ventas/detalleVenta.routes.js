const express = require('express');
const router = express.Router();

const controller = require('./detalleVenta.controller');
const { validateDetalleVenta, runValidations } = require('../../middlewares/validators');

router.get('/', controller.getAllDetalleVentas);
router.get('/:id', controller.getDetalleVentaById);
router.post('/', validateDetalleVenta, runValidations, controller.createDetalleVenta);
router.put('/:id', validateDetalleVenta, runValidations, controller.updateDetalleVenta);
router.patch('/:id', controller.partialUpdateDetalleVenta);
router.delete('/:id', controller.deleteDetalleVenta);

module.exports = router;