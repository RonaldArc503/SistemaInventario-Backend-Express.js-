const express = require('express');
const router = express.Router();

const controller = require('./estadoVenta.controller');
const { validateEstadoVenta, runValidations } = require('../../middlewares/validators');

router.get('/', controller.getAllEstadosVenta);
router.get('/:id', controller.getEstadoVentaById);
router.post('/', validateEstadoVenta, runValidations, controller.createEstadoVenta);
router.put('/:id', validateEstadoVenta, runValidations, controller.updateEstadoVenta);
router.patch('/:id', controller.partialUpdateEstadoVenta);
router.delete('/:id', controller.deleteEstadoVenta);

module.exports = router;