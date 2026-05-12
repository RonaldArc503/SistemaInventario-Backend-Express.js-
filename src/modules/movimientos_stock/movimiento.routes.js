const express = require('express');
const router = express.Router();

const controller = require('./movimiento.controller');
const { validateMovimientoStock, runValidations } = require('../../middlewares/validators');

router.get('/', controller.getAllMovimientosStock);
router.get('/:id', controller.getMovimientoStock);
router.post('/', validateMovimientoStock, runValidations, controller.createMovimientoStock);
router.put('/:id', validateMovimientoStock, runValidations, controller.updateMovimientoStock);
router.patch('/:id', controller.partialUpdateMovimientoStock);
router.delete('/:id', controller.deleteMovimientoStock);

module.exports = router;
