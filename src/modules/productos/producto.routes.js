const express = require('express');
const router = express.Router();

const productoController = require('./producto.controller');

router.get('/', productoController.getAllProductos);
router.get('/:id', productoController.getProductoById);
router.post('/', productoController.createProducto);

module.exports = router;