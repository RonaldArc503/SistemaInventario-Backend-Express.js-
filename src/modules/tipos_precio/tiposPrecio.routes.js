const express = require('express');
const router = express.Router();

const controller = require('./tiposPrecio.controller');
const { validateTipoPrecio, runValidations } = require('../../middlewares/validators');

router.get('/', controller.getAllTiposPrecio);
router.get('/:id', controller.getTipoPrecioById);
router.post('/', validateTipoPrecio, runValidations, controller.createTipoPrecio);
router.put('/:id', validateTipoPrecio, runValidations, controller.updateTipoPrecio);
router.patch('/:id', controller.partialUpdateTipoPrecio);
router.delete('/:id', controller.deleteTipoPrecio);

module.exports = router;