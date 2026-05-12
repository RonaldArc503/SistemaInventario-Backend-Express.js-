const express = require('express');
const router = express.Router();

const controller = require('./cliente.controller');
const { validateCliente, runValidations } = require('../../middlewares/validators');

router.get('/', controller.getAllClientes);
router.get('/:id', controller.getClienteById);
router.post('/', validateCliente, runValidations, controller.createCliente);
router.put('/:id', validateCliente, runValidations, controller.updateCliente);
router.patch('/:id', controller.partialUpdateCliente);
router.delete('/:id', controller.deleteCliente);

module.exports = router;