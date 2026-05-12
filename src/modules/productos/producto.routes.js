const express = require('express');
const router = express.Router();

const productoController = require('./producto.controller');
const { validateProducto, runValidations } = require('../../middlewares/validators');

router.get('/', productoController.getAllProductos);
router.get('/:id', productoController.getProductoById);
router.post('/', validateProducto, runValidations, productoController.createProducto);
router.put('/:id', validateProducto, runValidations, productoController.updateProducto);
router.patch('/:id', productoController.partialUpdateProducto);
router.delete('/:id', productoController.deleteProducto);

module.exports = router;