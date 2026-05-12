const express = require('express');
const router = express.Router();

const controller = require('./tipoMovimiento.controller');
const { validateTipoMovimientoStock, runValidations } = require('../../middlewares/validators');

router.get('/', controller.getAllTiposMovimiento);
router.get('/:id', controller.getTipoMovimientoById);
router.post('/', validateTipoMovimientoStock, runValidations, controller.createTipoMovimiento);
router.put('/:id', validateTipoMovimientoStock, runValidations, controller.updateTipoMovimiento);
router.patch('/:id', controller.partialUpdateTipoMovimiento);
router.delete('/:id', controller.deleteTipoMovimiento);

module.exports = router;
