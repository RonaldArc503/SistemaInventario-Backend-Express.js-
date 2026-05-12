const express = require('express');
const router = express.Router();

const controller = require('./preciosProducto.controller');
const { validatePrecioProducto, runValidations } = require('../../middlewares/validators');

router.get('/', controller.getAllPreciosProducto);
router.get('/:id', controller.getPrecioProductoById);
router.post('/', validatePrecioProducto, runValidations, controller.createPrecioProducto);
router.put('/:id', validatePrecioProducto, runValidations, controller.updatePrecioProducto);
router.patch('/:id', controller.partialUpdatePrecioProducto);
router.delete('/:id', controller.deletePrecioProducto);

module.exports = router;