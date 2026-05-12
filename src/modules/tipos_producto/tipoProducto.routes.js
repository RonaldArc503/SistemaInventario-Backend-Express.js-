const express = require('express');
const router = express.Router();

const controller = require('./tipoProducto.controller');
const { validateTipoProducto, runValidations } = require('../../middlewares/validators');

router.get('/', controller.getAllTiposProducto);
router.get('/:id', controller.getTipoProductoById);
router.post('/', validateTipoProducto, runValidations, controller.createTipoProducto);
router.put('/:id', validateTipoProducto, runValidations, controller.updateTipoProducto);
router.patch('/:id', controller.partialUpdateTipoProducto);
router.delete('/:id', controller.deleteTipoProducto);

module.exports = router;module.exports = {};
