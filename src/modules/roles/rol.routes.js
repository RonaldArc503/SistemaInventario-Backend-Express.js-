const express = require('express');
const router = express.Router();

const controller = require('./rol.controller');
const { validateRole, runValidations } = require('../../middlewares/validators');

router.get('/', controller.getAllRoles);
router.get('/:id', controller.getRoleById);
router.post('/', validateRole, runValidations, controller.createRole);
router.put('/:id', validateRole, runValidations, controller.updateRole);
router.patch('/:id', controller.partialUpdateRole);
router.delete('/:id', controller.deleteRole);

module.exports = router;module.exports = {};
